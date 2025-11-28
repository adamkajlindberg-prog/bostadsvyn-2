import { generateEmbedding } from "@/lib/ai/embedding";
import { getDbClient, riksbankMonetaryPolicy, riksbankVintages } from "../../../../../../packages/db";
import { cosineDistance, desc, eq, gt, sql } from "drizzle-orm";

const getMonetaryPolicyData = async (userQuery: string) => {
    const db = getDbClient();

    const userQueryEmbedded = await generateEmbedding(userQuery);

    const similarity = sql<number>`1 - (${cosineDistance(
        riksbankMonetaryPolicy.embedding,
        userQueryEmbedded,
    )})`;

    const similarData = await db
        .select({
            id: riksbankMonetaryPolicy.id,
            description: riksbankMonetaryPolicy.description,
            sourceAgency: riksbankMonetaryPolicy.sourceAgency,
            unit: riksbankMonetaryPolicy.unit,
            note: riksbankMonetaryPolicy.note,
            similarity,
        })
        .from(riksbankMonetaryPolicy)
        .where(gt(similarity, 0.5))
        .orderBy((t) => desc(t.similarity))
        .limit(4);

    // For each policy, get related vintages
    const data = [];
    for (const policy of similarData) {
        const vintages = await db
            .select({
                forecastCutoffDate: riksbankVintages.forecastCutoffDate,
                policyRound: riksbankVintages.policyRound,
                policyRoundEndDtm: riksbankVintages.policyRoundEndDtm,
                observations: riksbankVintages.observations,
            })
            .from(riksbankVintages)
            .where(eq(riksbankVintages.monetaryPolicyId, policy.id))
            .orderBy(desc(riksbankVintages.forecastCutoffDate))
            .limit(1);

        data.push({
            ...policy,
            vintages,
        });
    }

    return data;
};

export default getMonetaryPolicyData;