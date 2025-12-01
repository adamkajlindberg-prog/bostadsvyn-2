import { getDbClient, lantmateriet, lantmaterietCategory } from "db";
import { eq } from "drizzle-orm";
import { generateEmbeddings } from "../site/src/lib/ai/embedding";
import { setTimeoutDelay } from "../site/src/utils/set-timeout-delay";

type T_Category = {
  title: string;
  subtitle: string;
  authorName: string;
  authorEmail: string;
};

type T_Entry = {
  entryId: number | null;
  title: string;
  summary: string;
  polygon: { longitude: number; latitude: number }[];
};

const BATCH_SIZE = 100;

// Simple argument parser for --category
const getArg = (flag: string) => {
  const arg = process.argv.find((a) => a.startsWith(flag + "="));
  return arg ? arg.split("=")[1] : undefined;
};

const categoryArg = getArg("--category") || "";

// Map of category to Lantmäteriet API endpoints
const apiMap: Record<string, string> = {
  building: "https://api.lantmateriet.se/byggnad/atom/v1.1/inspire/bu",
  "cadastral-parcel":
    "https://api.lantmateriet.se/fastighetsomrade/atom/v1/inspire/cp",
  "physical-water":
    "https://api.lantmateriet.se/hydrografi/atom/v1.1/inspire/hyp",
  "hydro-network":
    "https://api.lantmateriet.se/hydrografi/atom/v1.1/inspire/hyn",
  "land-cover": "https://api.lantmateriet.se/marktacke/atom/v1.1/inspire/lc",
};

// Helper function to fetch data from the API
const fetchData = async (url: string): Promise<string> => {
  const response = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/xml" },
  });

  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

  return response.text();
};

// Helper function to extract tag values from XML response
const extractTagValue = (xml: string, tag: string): string => {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`));
  return match?.[1] ?? "";
};

// Helper function to extract entries from the XML response
const extractEntries = (xml: string) => {
  const entryList = xml.match(/<entry[\s\S]*?<\/entry>/g) || [];

  return entryList.map((entry) => {
    const title = extractTagValue(entry, "title");
    const summary = extractTagValue(entry, "summary");
    const polygonRaw = extractTagValue(entry, "georss:polygon");
    const rawEntryId = extractTagValue(entry, "id");

    const id = rawEntryId.match(/(\d+)(?!.*\d)/);
    const entryId = id ? Number(id[1]) : null;

    const polygon = polygonRaw
      ? polygonRaw
          .trim()
          .split(/\s+/)
          .reduce<{ longitude: number; latitude: number }[]>(
            (acc, val, idx, arr) => {
              if (idx % 2 === 0 && arr[idx + 1]) {
                const longitude = parseFloat(val);
                const latitude = parseFloat(arr[idx + 1] as string);
                if (!Number.isNaN(longitude) && !Number.isNaN(latitude)) {
                  acc.push({ longitude, latitude });
                }
              }
              return acc;
            },
            [],
          )
      : [];

    return { entryId, title, summary, polygon };
  });
};

// Insert or update Lantmäteriet categories and entries into DB
const upsertData = async (category: T_Category, entries: T_Entry[]) => {
  const db = getDbClient();

  if (category && entries.length > 0) {
    const existingCategory = await db
      .select({ id: lantmaterietCategory.id })
      .from(lantmaterietCategory)
      .where(eq(lantmaterietCategory.title, category.title))
      .limit(1);

    let categoryId: number | undefined;

    if (existingCategory.length > 0) {
      categoryId = existingCategory?.[0]?.id;
    } else {
      const embeddingQuery = await generateEmbeddings(category.title);

      const insert = await db
        .insert(lantmaterietCategory)
        .values({
          title: category.title,
          subtitle: category.subtitle,
          authorName: category.authorName,
          authorEmail: category.authorEmail,
          embedding: embeddingQuery?.[0]?.embedding ?? [],
        })
        .returning({ id: lantmaterietCategory.id });

      categoryId = insert?.[0]?.id;
    }

    for (let i = 0; i < entries.length; i += BATCH_SIZE) {
      const batch = entries.slice(i, i + BATCH_SIZE);
      console.log(
        `Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(entries.length / BATCH_SIZE)}...`,
      );

      await db.transaction(async (tx) => {
        for (const entry of batch) {
          if (entry.entryId === null) continue;

          await tx
            .insert(lantmateriet)
            .values({
              categoryId: categoryId as number,
              entryId: entry.entryId,
              title: entry.title,
              summary: entry.summary,
              geoPolygon: entry.polygon,
            })
            .onConflictDoUpdate({
              target: [lantmateriet.categoryId, lantmateriet.entryId],
              set: {
                title: entry.title,
                summary: entry.summary,
                geoPolygon: entry.polygon,
                updatedAt: new Date(),
              },
            });
        }
      });
      console.log(`Batch processed.`);

      await setTimeoutDelay(3000); // 3 seconds delay after each batch
    }
  }
};

// Main function to populate Lantmäteriet data by category
const populateLantmaterietData = async () => {
  try {
    if (!categoryArg) {
      console.error(
        `Error: You must provide category (--category="") in the script.`,
      );
      process.exit(1);
    }

    console.log(`Retrieving data from Lantmäteriet API (${categoryArg})...`);
    const apiUrl = apiMap[categoryArg];

    if (!apiUrl) {
      console.error(`Error: Invalid or missing category "${categoryArg}".`);
      process.exit(1);
    }

    const response = await fetchData(apiUrl);

    const category = {
      title: extractTagValue(response, "title"),
      subtitle: extractTagValue(response, "subtitle"),
      authorName: extractTagValue(response, "name"),
      authorEmail: extractTagValue(response, "email"),
    };
    const entries = extractEntries(response);

    await upsertData(category, entries);
    console.log(
      `SUCCESS! Lantmäteriet ${categoryArg} data populated successfully.`,
    );
  } catch (error) {
    console.error(
      `Failed to populate Lantmäteriet ${categoryArg} data:`,
      error,
    );
  }
};

/** 
Example command to run the script:
bun scripts/populate-lantmateriet-data --category="building"

Categories:
- building
- cadastral-parcel
- physical-water
- hydro-network
- land-cover
*/
populateLantmaterietData();
