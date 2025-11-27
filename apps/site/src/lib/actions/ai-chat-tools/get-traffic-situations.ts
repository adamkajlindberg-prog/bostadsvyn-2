import { generateEmbedding } from "@/lib/ai/embedding";
import { getDbClient, trafficSituations } from "../../../../../../packages/db";
import { cosineDistance, desc, gt, sql } from "drizzle-orm";

const getTrafficSituations = async (userQuery: string) => {
    const db = getDbClient();

    const userQueryEmbedded = await generateEmbedding(userQuery);

    const similarity = sql<number>`1 - (${cosineDistance(
        trafficSituations.embedding,
        userQueryEmbedded,
    )})`;

    const similarData = await db
        .select({
            roadName: trafficSituations.roadName,
            roadNumber: trafficSituations.roadNumber,
            coordinates: trafficSituations.coordinates,
            messageType: trafficSituations.messageType,
            messageTypeValue: trafficSituations.messageTypeValue,
            messageCode: trafficSituations.messageCode,
            messageCodeValue: trafficSituations.messageCodeValue,
            message: trafficSituations.message,
            severityCode: trafficSituations.severityCode,
            severityText: trafficSituations.severityText,
            startTime: trafficSituations.startTime,
            endTime: trafficSituations.endTime,
            validUntilFurtherNotice: trafficSituations.validUntilFurtherNotice,
            webLink: trafficSituations.webLink,
            countyNo: trafficSituations.countyNo,
            affectedDirection: trafficSituations.affectedDirection,
            affectedDirectionValue: trafficSituations.affectedDirectionValue,
            trafficRestrictionType: trafficSituations.trafficRestrictionType,
            numberOfLanesRestricted: trafficSituations.numberOfLanesRestricted,
            similarity,
        })
        .from(trafficSituations)
        .where(gt(similarity, 0.5))
        .orderBy((t) => desc(t.similarity))
        .limit(4);
    
    return similarData;
};

export default getTrafficSituations;