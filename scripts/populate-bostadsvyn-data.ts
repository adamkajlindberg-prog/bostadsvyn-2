import { bostadsvyn, getDbClient } from "../packages/db"
import { generateEmbeddings } from "../apps/site/src/lib/ai/embedding"
import { generateChunks } from "../apps/site/src/lib/ai/generate-chunk"

// Insert data chunks and their embeddings into DB
const insertData = async (chunks: string[]) => {
    const db = getDbClient()

    for (const content of chunks) {
        if (!content.trim()) continue
        // Generate embeddings for the chunk
        const embeddingQuery = await generateEmbeddings(content)

        // Save embeddings to embedding table
        await db.insert(bostadsvyn).values(
            embeddingQuery.map((embedding) => ({
                ...embedding,
            })),
        )
        
        console.log(`Saved chunk and embeddings: ${content.slice(0, 40)}...`)
    }
}

// Main function to populate Bostadsvyn data
const populateBostadsvynData = async () => {
    try {
        console.log("Processing embeddings...")

        const data = await generateChunks()
        const dataChunks = data.split("\n").filter(Boolean)
        await insertData(dataChunks)

        console.log("Chunks and embeddings generated and saved to DB.")
    } catch (error) {
        console.error("Error:", error)
    }
}

populateBostadsvynData()
