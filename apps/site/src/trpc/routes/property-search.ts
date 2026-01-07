import { getDbClient, properties, propertyEmbeddings, sql } from "db";
import {
  and,
  asc,
  cosineDistance,
  desc,
  eq,
  gt,
  gte,
  inArray,
  lte,
} from "drizzle-orm";
import z from "zod/v4";
import { generateEmbedding } from "@/lib/ai/embedding";
import { createTRPCRouter, publicProcedure } from "@/trpc/init";

const Z_Property_Search_Input = z.object({
  query: z.string().optional(),
  location: z.string().optional(),
  propertyType: z.string().optional(),
  listingType: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  minArea: z.number().optional(),
  maxArea: z.number().optional(),
  minRooms: z.number().optional(),
  maxRooms: z.number().optional(),
  features: z.array(z.string()).optional(),
  energyClass: z.array(z.string()).optional(),
  sortBy: z.string().optional(),
  minRent: z.number().optional(),
  maxRent: z.number().optional(),
  minMonthlyFee: z.number().optional(),
  maxMonthlyFee: z.number().optional(),
  minPlotArea: z.number().optional(),
  maxPlotArea: z.number().optional(),
  ai: z.boolean().optional(),
});

export type T_Property_Search_Input = z.infer<typeof Z_Property_Search_Input>;

const db = getDbClient();

const filterConditions = (input: T_Property_Search_Input) => {
  const conditions = [];

  // Location filter (using full-text search on address fields)
  if (input.location) {
    conditions.push(
      sql`(
        setweight(to_tsvector('swedish', ${properties.addressStreet}), 'A') ||
        setweight(to_tsvector('swedish', ${properties.addressCity}), 'B')
      ) @@ websearch_to_tsquery('swedish', ${input.location})`,
    );
  }

  // Property type filter
  if (input.propertyType) {
    conditions.push(
      eq(properties.propertyType, input.propertyType.toUpperCase()),
    );
  }

  // Listing type (status) filter
  if (input.listingType) {
    conditions.push(eq(properties.status, input.listingType.toUpperCase()));
  }

  // Price range filters
  if (input.minPrice !== undefined && input.minPrice > 0) {
    conditions.push(gte(properties.price, input.minPrice));
  }
  if (input.maxPrice !== undefined && input.maxPrice > 0) {
    conditions.push(lte(properties.price, input.maxPrice));
  }

  // Living area filters
  if (input.minArea !== undefined && input.minArea > 0) {
    conditions.push(gte(properties.livingArea, input.minArea));
  }
  if (input.maxArea !== undefined && input.maxArea > 0) {
    conditions.push(lte(properties.livingArea, input.maxArea));
  }

  // Rooms filters
  if (input.minRooms !== undefined && input.minRooms > 0) {
    conditions.push(gte(properties.rooms, input.minRooms));
  }
  if (input.maxRooms !== undefined && input.maxRooms > 0) {
    conditions.push(lte(properties.rooms, input.maxRooms));
  }

  // Monthly fee filters
  if (input.minMonthlyFee !== undefined && input.minMonthlyFee > 0) {
    conditions.push(gte(properties.monthlyFee, input.minMonthlyFee));
  }
  if (input.maxMonthlyFee !== undefined && input.maxMonthlyFee > 0) {
    conditions.push(lte(properties.monthlyFee, input.maxMonthlyFee));
  }

  // Plot area filters
  if (input.minPlotArea !== undefined && input.minPlotArea > 0) {
    conditions.push(gte(properties.plotArea, input.minPlotArea));
  }
  if (input.maxPlotArea !== undefined && input.maxPlotArea > 0) {
    conditions.push(lte(properties.plotArea, input.maxPlotArea));
  }

  // Energy class filter
  if (input.energyClass && input.energyClass.length > 0) {
    conditions.push(inArray(properties.energyClass, input.energyClass));
  }

  // Features filter - check if property has all specified features
  if (input.features && input.features.length > 0) {
    conditions.push(sql`${properties.features} @> ${input.features}`);
  }

  return conditions;
};

const getSortOrder = (sortBy?: string) => {
  switch (sortBy) {
    case "created_desc":
      return desc(properties.createdAt);
    case "created_asc":
      return asc(properties.createdAt);
    case "price_asc":
      return asc(properties.price);
    case "price_desc":
      return desc(properties.price);
    case "living_area_desc":
      return sql`${properties.livingArea} DESC NULLS LAST`;
    case "living_area_asc":
      return sql`${properties.livingArea} ASC NULLS LAST`;
    case "plot_area_desc":
      return sql`${properties.plotArea} DESC NULLS LAST`;
    case "plot_area_asc":
      return sql`${properties.plotArea} ASC NULLS LAST`;
    case "price_sqm_desc":
      return sql`(CASE WHEN ${properties.livingArea} > 0 THEN ${properties.price} / ${properties.livingArea} ELSE NULL END) ASC NULLS LAST`;
    case "price_sqm_asc":
      return sql`(CASE WHEN ${properties.livingArea} > 0 THEN ${properties.price} / ${properties.livingArea} ELSE NULL END) DESC NULLS LAST`;
    case "rooms_desc":
      return sql`${properties.rooms} DESC NULLS LAST`;
    case "rooms_asc":
      return sql`${properties.rooms} ASC NULLS LAST`;
    case "fee_desc":
      return sql`${properties.monthlyFee} DESC NULLS LAST`;
    case "fee_asc":
      return sql`${properties.monthlyFee} ASC NULLS LAST`;
    case "address_desc":
      return asc(properties.addressStreet);
    case "address_asc":
      return desc(properties.addressStreet);
    default:
      return desc(properties.createdAt); // Default sort by newest first
  }
};

const searchProperties = async (
  query: string,
  input: T_Property_Search_Input,
) => {
  const conditions = filterConditions(input);

  // Use AI search if ai parameter is true
  if (input.ai) {
    console.log("USED AI SEARCH");
    const queryEmbedded = await generateEmbedding(query);

    const similarity = sql<number>`1 - (${cosineDistance(
      propertyEmbeddings.embedding,
      queryEmbedded,
    )})`;

    const aiData = await db
      .select({
        property: properties,
        similarity,
      })
      .from(propertyEmbeddings)
      .innerJoin(properties, eq(propertyEmbeddings.propertyId, properties.id))
      .where(
        conditions.length > 0
          ? and(gt(similarity, 0.9), ...conditions)
          : gt(similarity, 0.9),
      )
      .orderBy((t) => desc(t.similarity));

    const aiProperties = aiData.map((r) => r.property);

    return {
      properties: aiProperties,
      total: aiProperties.length,
    };
  }

  // Otherwise use full-text search
  const textSearchCondition = sql`to_tsvector('swedish', 
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
          ) @@ websearch_to_tsquery('swedish', ${query})`;

  const allConditions = [...conditions, textSearchCondition];

  const fullTextData = await db
    .select()
    .from(properties)
    .where(and(...allConditions))
    .orderBy(getSortOrder(input.sortBy));

  console.log("USED FULL TEXT SEARCH");
  return {
    properties: fullTextData,
    total: fullTextData.length,
  };
};

const allProperties = async (input: T_Property_Search_Input) => {
  const conditions = filterConditions(input);

  const data = await db
    .select()
    .from(properties)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(getSortOrder(input.sortBy));

  return { properties: data, total: data.length };
};

const propertySearch = createTRPCRouter({
  search: publicProcedure
    .input(Z_Property_Search_Input)
    .query(async ({ input }) => {
      const query = input.query?.trim();

      if (!query) return await allProperties(input); // Return all properties if no query
      return await searchProperties(query, input); // Search properties based on query (AI search if ai=true, otherwise full-text search)
    }),
});

export default propertySearch;
