import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { bostadsvyn, getDbClient } from "db";
import { generateEmbeddings } from "../site/src/lib/ai/embedding";

// Insert data chunks and their embeddings into DB
const insertData = async (content: string) => {
  const db = getDbClient();

  if (!content.trim()) return;

  // Generate embeddings for the content (this will chunk it internally)
  const embeddingQuery = await generateEmbeddings(content);

  // Save embeddings to embedding table
  await db.insert(bostadsvyn).values(
    embeddingQuery.map((embedding) => ({
      ...embedding,
    })),
  );
};

// Main function to populate Bostadsvyn data
const populateBostadsvynData = async () => {
  try {
    console.log("Processing embeddings...");

    // Read and process the file using text-splitter
    const filePath = join(
      process.cwd(),
      "apps",
      "site",
      "src",
      "data",
      "data.txt",
    );
    const content = await readFile(filePath, "utf-8");
    const normalizedContent = content
      .replace(/\r\n/g, "\n")
      .replace(/\n+/g, " ");

    await insertData(normalizedContent);

    console.log("Chunks and embeddings generated and saved to DB.");
  } catch (error) {
    console.error("Error:", error);
  }
};

populateBostadsvynData();
