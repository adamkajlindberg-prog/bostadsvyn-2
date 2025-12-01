import { generateEmbedding } from "@/lib/ai/embedding";
import { getDbClient, schoolUnits } from "../../../../../../packages/db";
import { cosineDistance, desc, gt, sql } from "drizzle-orm";

const getSchoolUnits = async (userQuery: string) => {
    const db = getDbClient();

    const userQueryEmbedded = await generateEmbedding(userQuery);

    const similarity = sql<number>`1 - (${cosineDistance(
        schoolUnits.embedding,
        userQueryEmbedded,
    )})`;

    const similarData = await db
        .select({
            schoolUnitCode: schoolUnits.schoolUnitCode,
            displayName: schoolUnits.displayName,
            status: schoolUnits.status,
            url: schoolUnits.url,
            email: schoolUnits.email,
            phoneNumber: schoolUnits.phoneNumber,
            headMaster: schoolUnits.headMaster,
            streetAddress: schoolUnits.streetAddress,
            locality: schoolUnits.locality,
            postalCode: schoolUnits.postalCode,
            orientationType: schoolUnits.orientationType,
            schoolUnitType: schoolUnits.schoolUnitType,
            municipalityCode: schoolUnits.municipalityCode,
            specialSupportSchool: schoolUnits.specialSupportSchool,
            hospitalSchool: schoolUnits.hospitalSchool,
            startDate: schoolUnits.startDate,
            endDate: schoolUnits.endDate,
            similarity,
        })
        .from(schoolUnits)
        .where(gt(similarity, 0.5))
        .orderBy((t) => desc(t.similarity))
        .limit(4);

    return similarData;
};

export default getSchoolUnits;