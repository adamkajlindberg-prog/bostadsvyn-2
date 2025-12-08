import { cosineDistance, desc, gt, sql } from "drizzle-orm";
import { generateEmbedding } from "@/lib/ai/embedding";
import { getDbClient, hittaMaklare } from "../../../../../../packages/db";

const findBrokers = async (userQuery: string) => {
  const db = getDbClient();

  const userQueryEmbedded = await generateEmbedding(userQuery);

  const similarity = sql<number>`1 - (${cosineDistance(
    hittaMaklare.embedding,
    userQueryEmbedded,
  )})`;

  const similarData = await db
    .select({
      name: hittaMaklare.name,
      realEstateAgency: hittaMaklare.realEstateAgency,
      office: hittaMaklare.office,
      county: hittaMaklare.county,
      locality: hittaMaklare.locality,
      telephone: hittaMaklare.telephone,
      email: hittaMaklare.email,
      streetAddress: hittaMaklare.streetAddress,
      addressLocality: hittaMaklare.addressLocality,
      addressCountry: hittaMaklare.addressCountry,
      postalCode: hittaMaklare.postalCode,
      background: hittaMaklare.background,
      presentation: hittaMaklare.presentation,
      ratings: hittaMaklare.ratings,
      reviews: hittaMaklare.reviews,
      urlPath: hittaMaklare.urlPath,
      similarity,
    })
    .from(hittaMaklare)
    .where(gt(similarity, 0.8))
    .orderBy((t) => desc(t.similarity))
    .limit(4);

  return similarData.map((broker) => ({
    ...broker,
    link: `https://www.hittamaklare.se/${broker.urlPath}`,
  }));
};

export default findBrokers;
