import { desc, ilike, or, sql } from "drizzle-orm";
import { getDbClient, hittaMaklare } from "../../../../../../packages/db";

const findBrokers = async (location: string) => {
  const db = getDbClient();

  const locationLower = location.toLowerCase().trim();
  const locationPattern = `%${locationLower}%`;

  // Create relevance score: 3 = exact match on county, 2 = exact match on locality,
  // 1 = partial match on county, 0 = partial match on locality
  const relevance = sql<number>`
    CASE
      WHEN LOWER(${hittaMaklare.county}) = ${locationLower} THEN 3
      WHEN LOWER(${hittaMaklare.locality}) = ${locationLower} THEN 2
      WHEN LOWER(${hittaMaklare.county}) LIKE ${locationPattern} THEN 1
      WHEN LOWER(${hittaMaklare.locality}) LIKE ${locationPattern} THEN 0
      ELSE -1
    END
  `;

  const brokersData = await db
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
      relevance,
    })
    .from(hittaMaklare)
    .where(
      or(
        sql`LOWER(${hittaMaklare.county}) = ${locationLower}`,
        sql`LOWER(${hittaMaklare.locality}) = ${locationLower}`,
        ilike(hittaMaklare.county, locationPattern),
        ilike(hittaMaklare.locality, locationPattern),
      ),
    )
    .orderBy((t) => desc(t.relevance))
    .limit(5);

  return brokersData.map(({ relevance: _, ...broker }) => ({
    ...broker,
    link: `https://www.hittamaklare.se${broker.urlPath}`,
  }));
};

export default findBrokers;
