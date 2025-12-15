import { desc, getDbClient, getTableColumns, properties, sql } from "db";
import { NextResponse } from "next/server";

export const maxDuration = 30;

// export async function GET(req: Request) {
//   const { searchParams } = new URL(req.url);
//   const search = searchParams.get("search");

//   if (!search) {
//     return NextResponse.json(
//       { error: "Missing 'search' query parameter" },
//       { status: 400 },
//     );
//   }

//   const db = getDbClient();

//   const matchQuery = sql`(
//     setweight(to_tsvector('swedish', ${properties.addressCity}), 'A') ||
//     setweight(to_tsvector('swedish', ${properties.addressStreet}), 'B') ||
//     setweight(to_tsvector('swedish', ${properties.propertyType}), 'C') ||
//     setweight(to_tsvector('swedish', ${properties.status}), 'D')),
//     websearch_to_tsquery('swedish', ${search})`;

//   const results = await db
//     .select({
//       ...getTableColumns(properties),
//       rank: sql`ts_rank(${matchQuery})`,
//     })
//     .from(properties)
//     .where(
//       sql`(
//         setweight(to_tsvector('swedish', ${properties.addressCity}), 'A') ||
//         setweight(to_tsvector('swedish', ${properties.addressStreet}), 'B') ||
//         setweight(to_tsvector('swedish', ${properties.propertyType}), 'C') ||
//         setweight(to_tsvector('swedish', ${properties.status}), 'D')
//       ) @@ websearch_to_tsquery('swedish', ${search})`,
//     )
//     .orderBy((t) => desc(t.rank));

//   return NextResponse.json(results);
// }

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search");

  if (!search) {
    return NextResponse.json(
      { error: "Missing 'search' query parameter" },
      { status: 400 },
    );
  }

  const db = getDbClient();

  const results = await db
    .select()
    .from(properties)
    .where(
      sql`to_tsvector('swedish', 
        ${properties.title} || ' ' || 
        COALESCE(${properties.description}, '') || ' ' || 
        ${properties.propertyType} || ' ' || 
        ${properties.status} || ' ' ||
        ${properties.price}::text || ' ' ||
        ${properties.addressStreet} || ' ' ||
        ${properties.addressCity} || ' ' ||
        ${properties.addressPostalCode} || ' ' ||
        ${properties.addressCountry} || ' ' ||
        COALESCE(${properties.livingArea}::text, '') || ' ' ||
        COALESCE(${properties.plotArea}::text, '') || ' ' ||
        COALESCE(${properties.rooms}::text, '') || ' ' ||
        COALESCE(${properties.bedrooms}::text, '') || ' ' ||
        COALESCE(${properties.bathrooms}::text, '') || ' ' ||
        COALESCE(${properties.yearBuilt}::text, '') || ' ' ||
        COALESCE(${properties.energyClass}, '') || ' ' ||
        COALESCE(${properties.monthlyFee}::text, '') || ' ' ||
        COALESCE(array_to_string(${properties.features}, ' '), '') || ' ' ||
        COALESCE(${properties.operatingCosts}::text, '') || ' ' ||
        COALESCE(${properties.kitchenDescription}, '') || ' ' ||
        COALESCE(${properties.bathroomDescription}, '') || ' ' ||
        ${properties.adTier}
      ) @@ websearch_to_tsquery('swedish', ${search})`,
    );

  return NextResponse.json(results);
}
