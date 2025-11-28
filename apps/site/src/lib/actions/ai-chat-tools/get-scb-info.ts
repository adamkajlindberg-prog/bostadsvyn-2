import { generateEmbedding } from "@/lib/ai/embedding";
import { getDbClient, scb } from "../../../../../../packages/db";
import { cosineDistance, desc, gt, sql } from "drizzle-orm";

const getScbInfo = async (userQuery: string) => {
    const db = getDbClient();

    const userQueryEmbedded = await generateEmbedding(userQuery);

    const similarity = sql<number>`1 - (${cosineDistance(
        scb.embedding,
        userQueryEmbedded,
    )})`;

    const similarData = await db
        .select({
            label: scb.label,
            firstPeriod: scb.firstPeriod,
            lastPeriod: scb.lastPeriod,
            data: scb.data,
            similarity,
        })
        .from(scb)
        .where(gt(similarity, 0.5))
        .orderBy((t) => desc(t.similarity))
        .limit(4);

    return similarData;
};

export default getScbInfo;