"use server";

import {
  eq,
  getDbClient,
  type Property,
  properties,
  propertyEmbeddings,
} from "db";
import { getServerSession } from "@/auth/server-session";
import { uploadPropertyImage } from "@/lib/actions/images/upload-property-image";
import { generateEmbeddings } from "@/lib/ai/embedding";

const PROPERTY_TYPE_TO_ENDPOINT: Record<string, string> = {
  APARTMENT: "HousingCooperative",
  HOUSE: "House",
  COTTAGE: "Cottage",
  PLOT: "Plot",
  FARM: "Farm",
  COMMERCIAL: "CommercialProperty",
} as const;

const PROPERTY_STATUS: Record<string, string> = {
  SoonForSale: "COMING_SOON",
  ForSale: "FOR_SALE",
  Sold: "SOLD",
  ForRental: "FOR_RENT",
} as const;

const buildEmbeddingInput = (property: Property): string => {
  return [
    property.title,
    property.description,
    property.propertyType,
    property.status,
    property.price && `Pris ${property.price} kr`,
    property.addressCity,
    property.livingArea && `${property.livingArea} kvm`,
    property.plotArea && `Tomtarea ${property.plotArea} kvm`,
    property.rooms && `${property.rooms} rum`,
    property.bedrooms && `${property.bedrooms} sovrum`,
    property.bathrooms && `${property.bathrooms} badrum`,
    property.features?.join(", "),
    property.energyClass && `Energiklass ${property.energyClass}`,
    property.monthlyFee && `Månadsavgift ${property.monthlyFee} kr`,
    property.yearBuilt && `Byggår ${property.yearBuilt}`,
  ]
    .filter(Boolean)
    .join(". ");
};

const uploadImages = async (
  imageIds: string[],
  propertyType: string,
): Promise<string[]> => {
  if (imageIds.length === 0) {
    return [];
  }

  const uploadPromises = imageIds.map((imageId) =>
    uploadPropertyImage(imageId, propertyType),
  );

  const results = await Promise.all(uploadPromises);
  return results.filter((path): path is string => path !== null);
};

export const addProperty = async (
  title: string,
  type: string,
  objectId: string,
) => {
  try {
    // Early validation - check before database queries
    const session = await getServerSession();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Unauthorized. Please log in.",
      };
    }

    if (!title || !type || !objectId) {
      return {
        success: false,
        error: "Missing required fields.",
      };
    }

    const customerId = process.env.VITEC_DEMO_CUSTOMER_ID;
    const authToken = process.env.VITEC_DEMO_AUTH_TOKEN;

    if (!authToken) {
      return {
        success: false,
        error: "Vitec authentication token is not configured.",
      };
    }

    if (!customerId) {
      return {
        success: false,
        error: "Vitec customer ID is not configured.",
      };
    }

    const endpointType = PROPERTY_TYPE_TO_ENDPOINT[type];
    if (!endpointType) {
      return {
        success: false,
        error: "Unsupported property type",
      };
    }

    // Check if property already exists
    const db = getDbClient();
    const [existingProperty] = await db
      .select()
      .from(properties)
      .where(eq(properties.objectId, objectId))
      .limit(1);

    if (existingProperty) {
      return {
        success: false,
        error: "Property with this Object ID already exists.",
      };
    }

    // Fetch property data from Vitec
    const res = await fetch(
      `https://connect-qa.maklare.vitec.net/PublicAdvertising/${endpointType}/${customerId}/${objectId}`,
      {
        headers: {
          Authorization: `Basic ${authToken}`,
          Accept: "application/json",
        },
      },
    );

    if (!res.ok) {
      return {
        success: false,
        error: "Property not found in Vitec system",
      };
    }

    const data = await res.json();

    // Upload images in promise
    const imageIds = data?.images?.map((img: { id: string }) => img.id) || [];
    const images = await uploadImages(imageIds, type);

    const status = PROPERTY_STATUS[data.status];

    await db.transaction(async (tx) => {
      // Insert property
      const [property] = await tx
        .insert(properties)
        .values({
          userId: session.user.id,
          objectId,
          title,
          description: data?.texts?.saleDescription,
          propertyType: type,
          status,
          price: data?.price?.swedishCurrency,
          addressStreet: data?.address?.streetAddress,
          addressPostalCode: data?.address?.zipCode,
          addressCity: data?.address?.city,
          addressCountry: data?.address?.countryCode,
          livingArea: data?.building?.livingSpace,
          plotArea: data?.plotInfo?.plotSize,
          rooms: data?.building?.numberOfRooms,
          yearBuilt: data?.building?.yearBuilt,
          energyClass: data?.energyDeclaration?.energyClass || null,
          monthlyFee: data?.expenses?.monthlyFee,
          images,
          latitude: data?.address?.wgs84Coordinate?.latitude,
          longitude: data?.address?.wgs84Coordinate?.longitude,
          operatingCosts: data?.expenses?.operatingCosts,
        })
        .returning();

      // Generate property embeddings
      const input = buildEmbeddingInput(property);
      const embeddingQuery = await generateEmbeddings(input);

      // Store property embeddings
      await tx
        .insert(propertyEmbeddings)
        .values({
          propertyId: property.id,
          embedding: embeddingQuery?.[0]?.embedding ?? [],
        })
        .onConflictDoUpdate({
          target: propertyEmbeddings.propertyId,
          set: {
            embedding: embeddingQuery?.[0]?.embedding ?? [],
            updatedAt: new Date(),
          },
        });
    });

    return {
      success: true,
      message: "Property added successfully",
    };
  } catch (error) {
    console.error("Error adding property:", error);
    return {
      success: false,
      error: "Something went wrong. Please try again later.",
      details: (error as Error).message,
    };
  }
};
