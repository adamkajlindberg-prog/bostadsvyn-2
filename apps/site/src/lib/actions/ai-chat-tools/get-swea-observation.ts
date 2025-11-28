import { generateEmbedding } from "@/lib/ai/embedding";
import { getDbClient, riksbankSwea, riksbankSweaObservations} from "../../../../../../packages/db";
import { cosineDistance, desc, eq, gt, sql } from "drizzle-orm";

const getSweaObservation = async (userQuery: string) => {
    const db = getDbClient();

    const userQueryEmbedded = await generateEmbedding(userQuery);

    const similarity = sql<number>`1 - (${cosineDistance(
        riksbankSwea.embedding,
        userQueryEmbedded,
    )})`;

    const similarData = await db
        .select({
            id: riksbankSwea.id,
            seriesId: riksbankSwea.seriesId,
            shortDescription: riksbankSwea.shortDescription,
            midDescription: riksbankSwea.midDescription,
            longDescription: riksbankSwea.longDescription,
            source: riksbankSwea.source,
            observationMaxDate: riksbankSwea.observationMaxDate,
            observationMinDate: riksbankSwea.observationMinDate,
            seriesClosed: riksbankSwea.seriesClosed,
            similarity,
        })
        .from(riksbankSwea)
        .where(gt(similarity, 0.5))
        .orderBy((t) => desc(t.similarity))
        .limit(4);

    // For each series, get related observations
    const data = [];
    for (const series of similarData) {
        const vintages = await db
            .select({
                date: riksbankSweaObservations.date,
                value: riksbankSweaObservations.value,
            })
            .from(riksbankSweaObservations)
            .where(eq(riksbankSweaObservations.sweaId, series.id))
            .orderBy(desc(riksbankSweaObservations.date));

        data.push({
            ...series,
            vintages,
        });
    }

    return data;
};

export default getSweaObservation;