import { generateEmbedding } from "@/lib/ai/embedding";
import { getDbClient, lantmateriet, lantmaterietCategory } from "../../../../../../packages/db";
import { cosineDistance, desc, eq, gt, sql } from "drizzle-orm";

const getLantmateriet = async (userQuery: string) => {
    const db = getDbClient();

    const userQueryEmbedded = await generateEmbedding(userQuery);

    const similarity = sql<number>`1 - (${cosineDistance(
        lantmaterietCategory.embedding,
        userQueryEmbedded,
    )})`;

    const similarData = await db
        .select({
            id: lantmaterietCategory.id,
            title: lantmaterietCategory.title,
            subtitle: lantmaterietCategory.subtitle,
            authorName: lantmaterietCategory.authorName,
            authorEmail: lantmaterietCategory.authorEmail,
            similarity,
        })
        .from(lantmaterietCategory)
        .where(gt(similarity, 0.5))
        .orderBy((t) => desc(t.similarity))
        .limit(4);

    // For each category, get related entries
    const data = [];
    for (const category of similarData) {
        const entries = await db
            .select({
                entryId: lantmateriet.entryId,
                title: lantmateriet.title,
                summary: lantmateriet.summary,
                geoPolygon: lantmateriet.geoPolygon,
            })
            .from(lantmateriet)
            .where(eq(lantmateriet.categoryId, category.id))
            .limit(10);

        data.push({
            ...category,
            entries,
        });
    }

    return data;
};

export default getLantmateriet;