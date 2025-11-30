import { embeddings, getDbClient, resources } from "db";
import { generateEmbeddings } from "../site/src/lib/ai/embedding";
import { generateChunks } from "../site/src/lib/ai/generate-chunk";

type EmbeddingRow = Awaited<ReturnType<typeof generateEmbeddings>>[number];

const generateChunkEmbeddings = async (chunks: string[]) => {
  const db = getDbClient();
  for (const content of chunks) {
    if (!content.trim()) continue;
    // Save chunk to resources table
    const [resource] = await db
      .insert(resources)
      .values({ content })
      .returning();

    // Generate embeddings for the chunk
    const embeddingQuery = await generateEmbeddings(content);
    // Save embeddings to embedding table
    await db.insert(embeddings).values(
      embeddingQuery.map((embedding: EmbeddingRow) => ({
        resourceId: resource?.id,
        ...embedding,
      })),
    );
    console.log(`Saved chunk and embeddings: ${content.slice(0, 40)}...`);
  }
};

(async () => {
  try {
    console.log("Processing embeddings...");

    const svText = await generateChunks();
    const svChunks = svText.split("\n").filter(Boolean);
    await generateChunkEmbeddings(svChunks);

    console.log("Chunks and embeddings generated and saved to DB.");
  } catch (error) {
    console.error("Error:", error);
  }
})();
