import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { bostadsvyn, getDbClient } from "db";
import { generateEmbeddings } from "../site/src/lib/ai/embedding";

// Insert data chunks and their embeddings into DB
const insertData = async (chunks: string[]) => {
  const db = getDbClient();

  for (const content of chunks) {
    if (!content.trim()) continue;
    // Generate embeddings for the chunk
    const embeddingQuery = await generateEmbeddings(content);

    // Save embeddings to embedding table
    await db.insert(bostadsvyn).values(
      embeddingQuery.map((embedding) => ({
        ...embedding,
      })),
    );

    console.log(`Saved chunk and embeddings: ${content.slice(0, 40)}...`);
  }
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

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 100,
      chunkOverlap: 20,
      keepSeparator: false,
      separators: ["\n\n", "\n", ".", ",", ", "],
    });
    const dataChunks = await splitter.splitText(normalizedContent);

    await insertData(dataChunks);

    console.log("Chunks and embeddings generated and saved to DB.");
  } catch (error) {
    console.error("Error:", error);
  }
};

populateBostadsvynData();
