import { generateEmbedding } from "@/lib/ai/embedding";
import { getDbClient, policeEvents } from "../../../../../../packages/db";
import { cosineDistance, desc, gt, sql } from "drizzle-orm";

const getPoliceEvents = async (location: string) => {
    const db = getDbClient();

    const locationEmbedded = await generateEmbedding(location);

    const similarity = sql<number>`1 - (${cosineDistance(
        policeEvents.embedding,
        locationEmbedded,
    )})`;

    const similarData = await db
        .select({
            datetime: policeEvents.datetime,
            name: policeEvents.name,
            summary: policeEvents.summary,
            url: policeEvents.url,
            type: policeEvents.type,
            locationName: policeEvents.locationName,
            locationGpsLat: policeEvents.locationGpsLat,
            locationGpsLng: policeEvents.locationGpsLng,
            similarity,
        })
        .from(policeEvents)
        .where(gt(similarity, 0.5))
        .orderBy((t) => desc(t.similarity))
        .limit(4);
        
    const data = similarData.map(event => ({
        ...event,
        url: event.url ? `https://polisen.se${event.url}` : event.url, // Add "https://polisen.se" prefix to each url
    }));

    return data;
};

export default getPoliceEvents;