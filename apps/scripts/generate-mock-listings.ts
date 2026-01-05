import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ImageClient } from "@bostadsvyn/images/image-client";
import { eq, getDbClient, properties, user } from "db";
import { env } from "./env.js";

interface GeminiInlineData {
  data?: string;
}

interface GeminiPart {
  inlineData?: GeminiInlineData;
}

interface GeminiContent {
  parts?: GeminiPart[];
}

interface GeminiCandidate {
  content?: GeminiContent;
}

interface GeminiImageResponse {
  candidates?: GeminiCandidate[];
}

// Get the directory of this script file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const IMAGES_DIR = join(__dirname, "images");
const GEMINI_IMAGE_MODEL = "gemini-2.5-flash-image-preview";

// Ensure images directory exists
if (!existsSync(IMAGES_DIR)) {
  mkdirSync(IMAGES_DIR, { recursive: true });
}

// Initialize ImageClient
const imageClient = new ImageClient({
  accessKeyId: env.R2_ACCESS_KEY_ID,
  bucket: env.R2_BUCKET,
  endpoint: env.R2_ENDPOINT,
  region: env.R2_REGION || "auto",
  secretAccessKey: env.R2_ACCESS_SECRET,
});

// Swedish cities with coordinates
const SWEDISH_CITIES = [
  { name: "Stockholm", postalCode: "111", lat: 59.3293, lng: 18.0686 },
  { name: "Göteborg", postalCode: "411", lat: 57.7089, lng: 11.9746 },
  { name: "Malmö", postalCode: "211", lat: 55.6059, lng: 13.0007 },
  { name: "Uppsala", postalCode: "751", lat: 59.8586, lng: 17.6389 },
  { name: "Linköping", postalCode: "581", lat: 58.4108, lng: 15.6214 },
  { name: "Örebro", postalCode: "701", lat: 59.2741, lng: 15.2066 },
  { name: "Västerås", postalCode: "721", lat: 59.6099, lng: 16.5448 },
  { name: "Helsingborg", postalCode: "251", lat: 56.0467, lng: 12.6945 },
  { name: "Jönköping", postalCode: "551", lat: 57.7815, lng: 14.1562 },
  { name: "Norrköping", postalCode: "601", lat: 58.5877, lng: 16.1924 },
];

const STREET_NAMES = [
  "Storgatan",
  "Kungsgatan",
  "Drottninggatan",
  "Vasagatan",
  "Birger Jarlsgatan",
  "Strandvägen",
  "Östermalmsgatan",
  "Sveavägen",
  "Götgatan",
  "Hornsgatan",
  "Ringvägen",
  "Folkungagatan",
  "Södermalmstorg",
  "Gamla Stan",
  "Kungsholmen",
];

// Property type configurations
const PROPERTY_CONFIGS = [
  {
    type: "HOUSE" as const,
    statuses: ["FOR_SALE", "FOR_RENT", "COMING_SOON", "SOLD"] as const,
  },
  {
    type: "APARTMENT" as const,
    statuses: [
      "FOR_SALE",
      "FOR_RENT",
      "COMING_SOON",
      "SOLD",
      "RENTED",
    ] as const,
  },
  {
    type: "COTTAGE" as const,
    statuses: ["FOR_SALE", "FOR_RENT", "COMING_SOON"] as const,
  },
  { type: "PLOT" as const, statuses: ["FOR_SALE", "COMING_SOON"] as const },
  { type: "FARM" as const, statuses: ["FOR_SALE", "COMING_SOON"] as const },
  {
    type: "COMMERCIAL" as const,
    statuses: ["FOR_SALE", "FOR_RENT", "COMING_SOON"] as const,
  },
];

// Energy classes
const ENERGY_CLASSES = ["A", "B", "C", "D", "E", "F", "G"] as const;

// Namespace UUID for deterministic ID generation
const MOCK_PROPERTY_NAMESPACE = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";

/**
 * Generate deterministic UUID based on property index
 */
function generateDeterministicId(index: number): string {
  // Create a deterministic hash from the index using the namespace
  const hash = createHash("sha256")
    .update(MOCK_PROPERTY_NAMESPACE)
    .update(index.toString())
    .digest();

  // Format as UUID v4-like string (but deterministic)
  const hex = hash.toString("hex");
  const hexChar16 = hex[16];
  if (!hexChar16) {
    throw new Error("Hash too short for UUID generation");
  }
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    `4${hex.slice(13, 16)}`, // Version 4
    ((parseInt(hexChar16, 16) & 0x3) | 0x8).toString(16) + hex.slice(17, 20), // Variant bits
    hex.slice(20, 32),
  ].join("-");
}

/**
 * Validate that image path is an ID only (not a URL)
 */
function validateImagePath(imagePath: string): void {
  if (imagePath.includes("http://") || imagePath.includes("https://")) {
    throw new Error(`Image path must be an ID only, not a URL: ${imagePath}`);
  }
}

/**
 * Generate property image using Gemini
 */
async function generatePropertyImage(
  prompt: string,
  cachePath: string,
): Promise<Buffer> {
  // Check if image already exists locally
  if (existsSync(cachePath)) {
    console.log(`Using cached image: ${cachePath}`);
    return readFileSync(cachePath);
  }

  console.log(`Generating image with prompt: ${prompt}`);

  try {
    // Use Gemini REST API directly for image generation
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `Generate a high-quality, professional real estate photograph. ${prompt}`,
            },
          ],
        },
      ],
      generationConfig: {
        responseModalities: ["IMAGE"],
      },
    };

    const apiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_IMAGE_MODEL}:generateContent?key=${env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      },
    );

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text();
      throw new Error(`Gemini API error: ${apiResponse.status} ${errorText}`);
    }

    const apiData = (await apiResponse.json()) as GeminiImageResponse;

    // Extract image from response
    // The structure may be: candidates[0].content.parts[0].inlineData.data
    let imageBuffer: Buffer | null = null;

    if (apiData.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data) {
      const base64Image =
        apiData.candidates[0].content.parts[0].inlineData.data;
      imageBuffer = Buffer.from(base64Image, "base64");
    } else {
      // Alternative: check for image URL or other formats
      console.warn(
        "Unexpected response structure:",
        JSON.stringify(apiData, null, 2),
      );
      throw new Error("Could not extract image from Gemini response");
    }

    // Save to cache
    writeFileSync(cachePath, imageBuffer);
    console.log(`Saved image to cache: ${cachePath}`);

    return imageBuffer;
  } catch (error) {
    console.error(`Error generating image: ${error}`);
    throw error;
  }
}

/**
 * Check if image exists in R2 storage
 */
async function imageExistsInR2(
  propertyId: string,
  index: number,
): Promise<boolean> {
  const imageId = `properties/${propertyId}/${index}.jpg`;
  const url = `${env.R2_ENDPOINT}/${env.R2_BUCKET}/${imageId}`;

  try {
    // Use HEAD request to check if object exists
    // For public buckets, this works without signing
    // For private buckets, this may return 403, which we treat as "doesn't exist"
    const response = await fetch(url, {
      method: "HEAD",
    });

    if (response.ok) {
      return true;
    }

    // 404 means doesn't exist, 403 might mean private bucket (treat as doesn't exist)
    return false;
  } catch {
    // If request fails, assume image doesn't exist
    return false;
  }
}

/**
 * Upload image to R2 storage
 */
async function uploadImageToR2(
  imageBuffer: Buffer,
  propertyId: string,
  index: number,
): Promise<string> {
  const imageId = `properties/${propertyId}/${index}.jpg`;
  const mimeType = "image/jpeg";

  const arrayBuffer = imageBuffer.buffer.slice(
    imageBuffer.byteOffset,
    imageBuffer.byteOffset + imageBuffer.byteLength,
  ) as ArrayBuffer;

  await imageClient.upload({
    id: imageId,
    body: arrayBuffer,
    mimeType,
  });

  // Return just the relative path: propertyId/index.jpg
  return `${propertyId}/${index}.jpg`;
}

/**
 * Create or get test user
 */
async function createOrGetTestUser(): Promise<string> {
  const db = getDbClient();
  const testEmail = "mock-data-user@bostadsvyn.se";
  const testUserId = "mock-data-user-id";

  // Check if user exists
  const existingUser = await db
    .select()
    .from(user)
    .where(eq(user.id, testUserId))
    .limit(1);

  if (existingUser.length > 0) {
    console.log(`Using existing test user: ${testUserId}`);
    return testUserId;
  }

  // Create test user
  await db.insert(user).values({
    id: testUserId,
    name: "Mock Data User",
    email: testEmail,
    stripeCustomerId: "dummy-stripe-id",
    emailVerified: true,
  });

  console.log(`Created test user: ${testUserId}`);
  return testUserId;
}

/**
 * Generate property data
 */
function generatePropertyData(
  index: number,
  _userId: string,
): {
  propertyType:
    | "HOUSE"
    | "APARTMENT"
    | "COTTAGE"
    | "PLOT"
    | "FARM"
    | "COMMERCIAL";
  status: "COMING_SOON" | "FOR_SALE" | "SOLD" | "FOR_RENT" | "RENTED" | "DRAFT";
  city: (typeof SWEDISH_CITIES)[number];
  streetNumber: number;
  streetName: string;
  price: number;
  livingArea: number;
  plotArea?: number;
  rooms: number;
  bedrooms: number;
  bathrooms: number;
  yearBuilt: number;
  energyClass: (typeof ENERGY_CLASSES)[number] | null;
  monthlyFee?: number;
  description: string;
  title: string;
} {
  const configIndex = index % PROPERTY_CONFIGS.length;
  const config = PROPERTY_CONFIGS[configIndex];
  if (!config) {
    throw new Error(`Invalid property config index: ${configIndex}`);
  }
  const propertyType = config.type;
  const statusIndex = Math.floor(Math.random() * config.statuses.length);
  const status = config.statuses[statusIndex];
  if (!status) {
    throw new Error(`Invalid status index: ${statusIndex}`);
  }
  const cityIndex = Math.floor(Math.random() * SWEDISH_CITIES.length);
  const city = SWEDISH_CITIES[cityIndex];
  if (!city) {
    throw new Error(`Invalid city index: ${cityIndex}`);
  }
  const streetNameIndex = Math.floor(Math.random() * STREET_NAMES.length);
  const streetName = STREET_NAMES[streetNameIndex];
  if (!streetName) {
    throw new Error(`Invalid street name index: ${streetNameIndex}`);
  }
  const streetNumber = Math.floor(Math.random() * 100) + 1;

  // Generate realistic data based on property type
  let price: number;
  let livingArea: number;
  let plotArea: number | undefined;
  let rooms: number;
  let bedrooms: number;
  let bathrooms: number;
  let yearBuilt: number;
  let monthlyFee: number | undefined;
  let description: string;
  let title: string;

  switch (propertyType) {
    case "HOUSE":
      price = Math.floor(Math.random() * 10000000) + 2000000; // 2M - 12M
      livingArea = Math.floor(Math.random() * 200) + 80; // 80-280 m²
      plotArea = Math.floor(Math.random() * 1000) + 500; // 500-1500 m²
      rooms = Math.floor(Math.random() * 5) + 4; // 4-8 rooms
      bedrooms = Math.floor(Math.random() * 3) + 3; // 3-5 bedrooms
      bathrooms = Math.floor(Math.random() * 2) + 2; // 2-3 bathrooms
      yearBuilt = Math.floor(Math.random() * 50) + 1970; // 1970-2020
      title = `${propertyType === "HOUSE" ? "Villa" : propertyType} i ${city.name}`;
      description = `Fantastisk ${propertyType.toLowerCase()} med ${rooms} rum, ${bedrooms} sovrum och ${bathrooms} badrum. ${livingArea} m² boarea på ${plotArea} m² tomt.`;
      break;

    case "APARTMENT":
      price = Math.floor(Math.random() * 8000000) + 1000000; // 1M - 9M
      livingArea = Math.floor(Math.random() * 100) + 40; // 40-140 m²
      rooms = Math.floor(Math.random() * 4) + 2; // 2-5 rooms
      bedrooms = Math.floor(Math.random() * 3) + 1; // 1-3 bedrooms
      bathrooms = Math.floor(Math.random() * 2) + 1; // 1-2 bathrooms
      yearBuilt = Math.floor(Math.random() * 30) + 1990; // 1990-2020
      monthlyFee = Math.floor(Math.random() * 8000) + 2000; // 2000-10000 SEK
      title = `Lägenhet i ${city.name}`;
      description = `Modern ${propertyType.toLowerCase()} med ${rooms} rum, ${bedrooms} sovrum och ${bathrooms} badrum. ${livingArea} m² boarea.`;
      break;

    case "COTTAGE":
      price = Math.floor(Math.random() * 5000000) + 500000; // 500K - 5.5M
      livingArea = Math.floor(Math.random() * 150) + 50; // 50-200 m²
      plotArea = Math.floor(Math.random() * 5000) + 1000; // 1000-6000 m²
      rooms = Math.floor(Math.random() * 4) + 3; // 3-6 rooms
      bedrooms = Math.floor(Math.random() * 3) + 2; // 2-4 bedrooms
      bathrooms = Math.floor(Math.random() * 2) + 1; // 1-2 bathrooms
      yearBuilt = Math.floor(Math.random() * 60) + 1960; // 1960-2020
      title = `Fritidshus i ${city.name}`;
      description = `Nostalgiskt ${propertyType.toLowerCase()} med ${rooms} rum och ${bedrooms} sovrum. ${livingArea} m² boarea på ${plotArea} m² tomt.`;
      break;

    case "PLOT":
      price = Math.floor(Math.random() * 3000000) + 200000; // 200K - 3.2M
      plotArea = Math.floor(Math.random() * 5000) + 500; // 500-5500 m²
      rooms = 0;
      bedrooms = 0;
      bathrooms = 0;
      livingArea = 0;
      yearBuilt = 0; // Will be set to null when inserting
      title = `Tomt i ${city.name}`;
      description = `Byggbar tomt på ${plotArea} m² i ${city.name}.`;
      break;

    case "FARM":
      price = Math.floor(Math.random() * 15000000) + 3000000; // 3M - 18M
      livingArea = Math.floor(Math.random() * 400) + 150; // 150-550 m²
      plotArea = Math.floor(Math.random() * 50000) + 10000; // 10000-60000 m²
      rooms = Math.floor(Math.random() * 10) + 6; // 6-15 rooms
      bedrooms = Math.floor(Math.random() * 5) + 4; // 4-8 bedrooms
      bathrooms = Math.floor(Math.random() * 4) + 2; // 2-5 bathrooms
      yearBuilt = Math.floor(Math.random() * 100) + 1900; // 1900-2000
      title = `Gård i ${city.name}`;
      description = `Stor ${propertyType.toLowerCase()} med ${rooms} rum, ${bedrooms} sovrum och ${bathrooms} badrum. ${livingArea} m² boarea på ${plotArea} m² mark.`;
      break;

    case "COMMERCIAL":
      price = Math.floor(Math.random() * 20000000) + 5000000; // 5M - 25M
      livingArea = Math.floor(Math.random() * 500) + 100; // 100-600 m²
      rooms = Math.floor(Math.random() * 10) + 5; // 5-14 rooms
      bedrooms = 0;
      bathrooms = Math.floor(Math.random() * 3) + 1; // 1-3 bathrooms
      yearBuilt = Math.floor(Math.random() * 40) + 1980; // 1980-2020
      title = `Lokaler i ${city.name}`;
      description = `Kommersiella ${propertyType.toLowerCase()} med ${livingArea} m² yta.`;
      break;
  }

  const energyClassIndex = Math.floor(Math.random() * ENERGY_CLASSES.length);
  const energyClass =
    Math.random() > 0.3 ? (ENERGY_CLASSES[energyClassIndex] ?? null) : null;

  return {
    propertyType,
    status,
    city,
    streetNumber,
    streetName,
    price,
    livingArea,
    plotArea,
    rooms,
    bedrooms,
    bathrooms,
    yearBuilt: yearBuilt || 0,
    energyClass,
    monthlyFee,
    description,
    title,
  };
}

/**
 * Generate image prompt for property
 */
function generateImagePrompt(
  propertyType: string,
  city: string,
  description: string,
  imageIndex: number,
): string {
  const imageTypes = [
    "exterior front view",
    "interior living room",
    "interior kitchen",
    "exterior garden or yard",
    "interior bedroom",
  ];

  const imageType = imageTypes[imageIndex % imageTypes.length];

  return `Professional real estate photograph: ${imageType} of a modern Swedish ${propertyType.toLowerCase()} in ${city}. ${description}. High quality, well-lit, realistic property photo suitable for real estate listing.`;
}

/**
 * Main function to generate mock properties
 */
async function generateMockProperties() {
  const db = getDbClient();
  const userId = await createOrGetTestUser();
  const numProperties = 50;

  console.log(`Generating ${numProperties} mock properties...`);

  for (let i = 0; i < numProperties; i++) {
    try {
      console.log(`\n[${i + 1}/${numProperties}] Generating property...`);

      // Generate property data
      const propertyData = generatePropertyData(i, userId);
      const propertyId = generateDeterministicId(i);

      // Generate 3-5 images per property
      const numImages = Math.floor(Math.random() * 3) + 3; // 3-5 images
      const imagePaths: string[] = [];

      for (let imgIndex = 0; imgIndex < numImages; imgIndex++) {
        try {
          // Check if image already exists in R2
          const existsInR2 = await imageExistsInR2(propertyId, imgIndex);
          if (existsInR2) {
            console.log(
              `  ✓ Image ${imgIndex + 1}/${numImages} already exists in R2, skipping`,
            );
            const existingImagePath = `${propertyId}/${imgIndex}.jpg`;
            // Validate image path is ID only, not URL
            validateImagePath(existingImagePath);
            imagePaths.push(existingImagePath);
            continue;
          }

          // Generate image prompt
          const prompt = generateImagePrompt(
            propertyData.propertyType,
            propertyData.city.name,
            propertyData.description,
            imgIndex,
          );

          // Cache path
          const cacheFileName = `${propertyData.propertyType.toLowerCase()}-${i}-${imgIndex}.jpg`;
          const cachePath = join(IMAGES_DIR, cacheFileName);

          // Generate or retrieve image
          const imageBuffer = await generatePropertyImage(prompt, cachePath);

          // Upload to R2
          const imagePath = await uploadImageToR2(
            imageBuffer,
            propertyId,
            imgIndex,
          );
          // Validate image path is ID only, not URL
          validateImagePath(imagePath);
          imagePaths.push(imagePath);

          console.log(
            `  ✓ Image ${imgIndex + 1}/${numImages} generated and uploaded`,
          );
        } catch (error) {
          console.error(`  ✗ Error generating image ${imgIndex + 1}: ${error}`);
          // Continue with other images
        }
      }

      // Ensure all properties have images
      if (imagePaths.length === 0) {
        throw new Error(
          `Failed to generate images for property ${propertyId}. All properties must have images.`,
        );
      }

      // Validate all image paths are IDs only
      for (const imagePath of imagePaths) {
        validateImagePath(imagePath);
      }

      console.log(
        `  ✓ Generated ${imagePaths.length} images:`,
        imagePaths.slice(0, 2), // Show first 2 paths
      );

      // Upsert property into database
      const propertyValues = {
        id: propertyId,
        userId,
        objectId: propertyId,
        title: propertyData.title,
        description: propertyData.description,
        propertyType: propertyData.propertyType,
        status: propertyData.status,
        price: propertyData.price,
        addressStreet: `${propertyData.streetName} ${propertyData.streetNumber}`,
        addressPostalCode: `${propertyData.city.postalCode}${Math.floor(Math.random() * 100)}`,
        addressCity: propertyData.city.name,
        addressCountry: "SE",
        livingArea: propertyData.livingArea || null,
        plotArea: propertyData.plotArea || null,
        rooms: propertyData.rooms || null,
        bedrooms: propertyData.bedrooms || null,
        bathrooms: propertyData.bathrooms || null,
        yearBuilt: propertyData.yearBuilt > 0 ? propertyData.yearBuilt : null,
        energyClass: propertyData.energyClass,
        monthlyFee: propertyData.monthlyFee || null,
        images: imagePaths, // Always set images (never null or empty)
        latitude: propertyData.city.lat.toString(),
        longitude: propertyData.city.lng.toString(),
      };

      await db
        .insert(properties)
        .values(propertyValues)
        .onConflictDoUpdate({
          target: properties.id,
          set: {
            userId: propertyValues.userId,
            title: propertyValues.title,
            description: propertyValues.description,
            propertyType: propertyValues.propertyType,
            status: propertyValues.status,
            price: propertyValues.price,
            addressStreet: propertyValues.addressStreet,
            addressPostalCode: propertyValues.addressPostalCode,
            addressCity: propertyValues.addressCity,
            addressCountry: propertyValues.addressCountry,
            livingArea: propertyValues.livingArea,
            plotArea: propertyValues.plotArea,
            rooms: propertyValues.rooms,
            bedrooms: propertyValues.bedrooms,
            bathrooms: propertyValues.bathrooms,
            yearBuilt: propertyValues.yearBuilt,
            energyClass: propertyValues.energyClass,
            monthlyFee: propertyValues.monthlyFee,
            images: propertyValues.images,
            latitude: propertyValues.latitude,
            longitude: propertyValues.longitude,
            updatedAt: new Date(),
          },
        });

      console.log(
        `  ✓ Property upserted: ${propertyData.title} (${imagePaths.length} images)`,
      );
    } catch (error) {
      console.error(`  ✗ Error generating property ${i + 1}: ${error}`);
      // Continue with next property
    }
  }

  console.log(`\n✓ Generated ${numProperties} mock properties successfully!`);
}

// Run the script
(async () => {
  try {
    await generateMockProperties();
    process.exit(0);
  } catch (error) {
    console.error("Fatal error:", error);
    process.exit(1);
  }
})();
