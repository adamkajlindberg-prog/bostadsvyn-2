import { generateEmbeddings } from "../apps/site/src/lib/ai/embedding";
import { generateChunks } from "../apps/site/src/lib/ai/generate-chunk";
import { embeddings, getDbClient, resources } from "../packages/db";

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
      embeddingQuery.map((embedding) => ({
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
