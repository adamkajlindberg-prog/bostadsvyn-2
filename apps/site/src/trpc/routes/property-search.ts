import { count, getDbClient, properties, propertyEmbeddings, sql } from "db";
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
  type SQL,
} from "drizzle-orm";
import type { PgColumn } from "drizzle-orm/pg-core";
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

// Helper function to add range filters
const addRangeFilter = (
  conditions: SQL[],
  column: PgColumn,
  min?: number,
  max?: number,
) => {
  if (min !== undefined && min > 0) {
    conditions.push(gte(column, min));
  }
  if (max !== undefined && max > 0) {
    conditions.push(lte(column, max));
  }
};

// Unified filter conditions function
const filterConditions = (
  input: T_Property_Search_Input,
  includeListingType = true,
): SQL[] => {
  const conditions: SQL[] = [];

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
  if (includeListingType && input.listingType && input.listingType !== "ALL") {
    conditions.push(eq(properties.status, input.listingType.toUpperCase()));
  }

  // Range filters using helper function
  addRangeFilter(conditions, properties.price, input.minPrice, input.maxPrice);
  addRangeFilter(
    conditions,
    properties.livingArea,
    input.minArea,
    input.maxArea,
  );
  addRangeFilter(conditions, properties.rooms, input.minRooms, input.maxRooms);
  addRangeFilter(
    conditions,
    properties.monthlyFee,
    input.minMonthlyFee,
    input.maxMonthlyFee,
  );
  addRangeFilter(
    conditions,
    properties.plotArea,
    input.minPlotArea,
    input.maxPlotArea,
  );

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

// Calculate counts for all listing types using a single query with conditional aggregation
const calculateListingTypeCounts = async (
  input: T_Property_Search_Input,
  textSearchCondition?: SQL,
) => {
  const baseConditions = filterConditions(input, false);
  const allConditions = textSearchCondition
    ? [...baseConditions, textSearchCondition]
    : baseConditions;

  const whereClause =
    allConditions.length > 0 ? and(...allConditions) : undefined;

  // Single query with conditional aggregation for all counts
  const countsResult = await db
    .select({
      all: count(),
      forSale: sql<number>`COUNT(*) FILTER (WHERE ${properties.status} = 'FOR_SALE')`,
      forRent: sql<number>`COUNT(*) FILTER (WHERE ${properties.status} = 'FOR_RENT')`,
      comingSoon: sql<number>`COUNT(*) FILTER (WHERE ${properties.status} = 'COMING_SOON')`,
      sold: sql<number>`COUNT(*) FILTER (WHERE ${properties.status} = 'SOLD')`,
      nyproduktion: sql<number>`COUNT(*) FILTER (WHERE ${properties.status} = 'NYPRODUKTION')`,
      commercial: sql<number>`COUNT(*) FILTER (WHERE ${properties.status} = 'COMMERCIAL')`,
    })
    .from(properties)
    .where(whereClause);

  const result = countsResult[0] ?? {
    all: 0,
    forSale: 0,
    forRent: 0,
    comingSoon: 0,
    sold: 0,
    nyproduktion: 0,
    commercial: 0,
  };

  return {
    ALL: Number(result.all),
    FOR_SALE: Number(result.forSale),
    FOR_RENT: Number(result.forRent),
    COMING_SOON: Number(result.comingSoon),
    SOLD: Number(result.sold),
    NYPRODUKTION: Number(result.nyproduktion),
    COMMERCIAL: Number(result.commercial),
  };
};

// Calculate counts for AI search using a single query with conditional aggregation
const calculateListingTypeCountsForAI = async (
  input: T_Property_Search_Input,
  queryEmbedded: number[],
) => {
  const baseConditions = filterConditions(input, false);

  const similarity = sql<number>`1 - (${cosineDistance(
    propertyEmbeddings.embedding,
    queryEmbedded,
  )})`;

  const similarityCondition = gt(similarity, 0.8);

  const allConditions =
    baseConditions.length > 0
      ? and(similarityCondition, ...baseConditions)
      : similarityCondition;

  // Single query with conditional aggregation for all counts
  const countsResult = await db
    .select({
      all: count(),
      forSale: sql<number>`COUNT(*) FILTER (WHERE ${properties.status} = 'FOR_SALE')`,
      forRent: sql<number>`COUNT(*) FILTER (WHERE ${properties.status} = 'FOR_RENT')`,
      comingSoon: sql<number>`COUNT(*) FILTER (WHERE ${properties.status} = 'COMING_SOON')`,
      sold: sql<number>`COUNT(*) FILTER (WHERE ${properties.status} = 'SOLD')`,
      nyproduktion: sql<number>`COUNT(*) FILTER (WHERE ${properties.status} = 'NYPRODUKTION')`,
      commercial: sql<number>`COUNT(*) FILTER (WHERE ${properties.status} = 'COMMERCIAL')`,
    })
    .from(propertyEmbeddings)
    .innerJoin(properties, eq(propertyEmbeddings.propertyId, properties.id))
    .where(allConditions);

  const result = countsResult[0] ?? {
    all: 0,
    forSale: 0,
    forRent: 0,
    comingSoon: 0,
    sold: 0,
    nyproduktion: 0,
    commercial: 0,
  };

  return {
    ALL: Number(result.all),
    FOR_SALE: Number(result.forSale),
    FOR_RENT: Number(result.forRent),
    COMING_SOON: Number(result.comingSoon),
    SOLD: Number(result.sold),
    NYPRODUKTION: Number(result.nyproduktion),
    COMMERCIAL: Number(result.commercial),
  };
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
    const queryEmbedded = await generateEmbedding(query);

    const similarity = sql<number>`1 - (${cosineDistance(
      propertyEmbeddings.embedding,
      queryEmbedded,
    )})`;

    const similarityCondition = gt(similarity, 0.8);

    const aiData = await db
      .select({
        property: properties,
        similarity,
      })
      .from(propertyEmbeddings)
      .innerJoin(properties, eq(propertyEmbeddings.propertyId, properties.id))
      .where(
        conditions.length > 0
          ? and(similarityCondition, ...conditions)
          : similarityCondition,
      )
      .orderBy((t) => desc(t.similarity));

    const aiProperties = aiData.map((r) => r.property);

    // Calculate counts for AI search (using similarity condition)
    const counts = await calculateListingTypeCountsForAI(input, queryEmbedded);

    return {
      properties: aiProperties,
      total: aiProperties.length,
      counts,
    };
  }

  // Use optimized database function for full-text search
  const textSearchCondition = sql`property_search_vector(
    ${properties.title},
    ${properties.description},
    ${properties.propertyType},
    ${properties.status},
    ${properties.price},
    ${properties.addressStreet},
    ${properties.addressCity},
    ${properties.livingArea},
    ${properties.plotArea},
    ${properties.rooms},
    ${properties.bedrooms},
    ${properties.bathrooms},
    ${properties.yearBuilt},
    ${properties.monthlyFee},
    ${properties.features},
    ${properties.operatingCosts},
    ${properties.kitchenDescription},
    ${properties.bathroomDescription},
    ${properties.adTier}
  ) @@ websearch_to_tsquery('swedish', ${query})`;

  const allConditions = [...conditions, textSearchCondition];

  const fullTextData = await db
    .select()
    .from(properties)
    .where(and(...allConditions))
    .orderBy(getSortOrder(input.sortBy));

  // Calculate counts for full-text search
  const counts = await calculateListingTypeCounts(input, textSearchCondition);

  return {
    properties: fullTextData,
    total: fullTextData.length,
    counts,
  };
};

const allProperties = async (input: T_Property_Search_Input) => {
  const conditions = filterConditions(input);

  const data = await db
    .select()
    .from(properties)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(getSortOrder(input.sortBy));

  // Calculate counts (no text search condition for all properties)
  const counts = await calculateListingTypeCounts(input);

  return { properties: data, total: data.length, counts };
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
