import type { TRPCRouterRecord } from "@trpc/server";
import { getDbClient, properties, propertyEmbeddings } from "db";
import {
  and,
  cosineDistance,
  desc,
  eq,
  gt,
  gte,
  ilike,
  lte,
  or,
  sql,
} from "drizzle-orm";
import z from "zod/v4";
import { generateEmbedding } from "@/lib/ai/embedding";
import { publicProcedure } from "@/trpc/init";

const zPropertySearchInput = z.object({
  aiQuery: z.string().optional(),
  aiSearch: z.boolean().optional(),
  query: z.string().optional(),
  propertyType: z.string().optional(),
  listingType: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  minArea: z.number().optional(),
  maxArea: z.number().optional(),
  minRooms: z.number().optional(),
  maxRooms: z.number().optional(),
  city: z.string().optional(),
  features: z.array(z.string()).optional(),
  energyClass: z.array(z.string()).optional(),
  sortBy: z.string().optional(),
  minRent: z.number().optional(),
  maxRent: z.number().optional(),
  minMonthlyFee: z.number().optional(),
  maxMonthlyFee: z.number().optional(),
  minPlotArea: z.number().optional(),
  maxPlotArea: z.number().optional(),
});

export type PropertySearchInput = z.infer<typeof zPropertySearchInput>;

const propertyRouter = {
  // --- Search ---
  search: publicProcedure
    .input(zPropertySearchInput)
    .query(async ({ input }) => {
      try {
        const db = getDbClient();

        if (
          input.aiSearch &&
          input.aiQuery &&
          input.aiQuery.trim().length > 0
        ) {
          const queryEmbedded = await generateEmbedding(input.aiQuery);

          const similarity = sql<number>`1 - (${cosineDistance(
            propertyEmbeddings.embedding,
            queryEmbedded,
          )})`;

          // Join propertyEmbeddings with properties to get full property data
          const results = await db
            .select({
              property: properties,
              similarity,
            })
            .from(propertyEmbeddings)
            .innerJoin(
              properties,
              eq(propertyEmbeddings.propertyId, properties.id),
            )
            .where(gt(similarity, 0.9))
            .orderBy((t) => desc(t.similarity));

          // Map to just the property objects (optionally include similarity if needed)
          return {
            properties: results.map((r) => r.property),
            total: results.length,
          };
        } else {
          // Build where conditions
          const conditions = [];

          // Text search (query)
          if (input.query && input.query.trim().length > 0) {
            conditions.push(
              or(
                ilike(properties.addressCity, `%${input.query}%`),
                ilike(properties.addressStreet, `%${input.query}%`),
              ),
            );
          }

          // City filter
          if (input.city && input.city.trim().length > 0)
            conditions.push(ilike(properties.addressCity, `%${input.city}%`));

          // Property type filter
          if (input.propertyType) {
            conditions.push(
              eq(properties.propertyType, input.propertyType.toUpperCase()),
            );
          }

          // Listing type filter (status)
          if (input.listingType)
            conditions.push(eq(properties.status, input.listingType));

          // Price range
          if (input.minPrice !== undefined && input.minPrice > 0)
            conditions.push(gte(properties.price, input.minPrice));
          if (input.maxPrice !== undefined && input.maxPrice < 20000000)
            conditions.push(lte(properties.price, input.maxPrice));

          // Living area range
          if (input.minArea !== undefined && input.minArea > 0)
            conditions.push(gte(properties.livingArea, input.minArea));
          if (input.maxArea !== undefined && input.maxArea < 1000)
            conditions.push(lte(properties.livingArea, input.maxArea));

          // Rooms range
          if (input.minRooms !== undefined && input.minRooms > 0)
            conditions.push(gte(properties.rooms, input.minRooms));
          if (input.maxRooms !== undefined && input.maxRooms < 10)
            conditions.push(lte(properties.rooms, input.maxRooms));

          // Monthly fee range
          if (input.minMonthlyFee !== undefined && input.minMonthlyFee > 0)
            conditions.push(gte(properties.monthlyFee, input.minMonthlyFee));
          if (input.maxMonthlyFee !== undefined && input.maxMonthlyFee < 10000)
            conditions.push(lte(properties.monthlyFee, input.maxMonthlyFee));

          // Plot area range
          if (input.minPlotArea !== undefined && input.minPlotArea > 0)
            conditions.push(gte(properties.plotArea, input.minPlotArea));
          if (input.maxPlotArea !== undefined && input.maxPlotArea < 10000)
            conditions.push(lte(properties.plotArea, input.maxPlotArea));

          // Features filter (array contains all selected features)
          if (input.features && input.features.length > 0) {
            conditions.push(
              sql`${properties.features} @> ${JSON.stringify(input.features)}::jsonb`,
            );
          }

          // Energy class filter
          if (input.energyClass && input.energyClass.length > 0) {
            conditions.push(
              sql`${properties.energyClass} = ANY(${input.energyClass})`,
            );
          }

          // Build query with filters and sorting
          let baseQuery = db.select().from(properties);

          // Apply where conditions
          if (conditions.length > 0)
            baseQuery = baseQuery.where(and(...conditions)) as typeof baseQuery;

          // Apply sorting
          const sortBy = input.sortBy || "created_desc";
          let finalQuery: typeof baseQuery;

          switch (sortBy) {
            case "created_desc":
              finalQuery = baseQuery.orderBy(
                sql`${properties.createdAt} DESC`,
              ) as typeof baseQuery;
              break;
            case "created_asc":
              finalQuery = baseQuery.orderBy(
                sql`${properties.createdAt} ASC`,
              ) as typeof baseQuery;
              break;
            case "price_asc":
              finalQuery = baseQuery.orderBy(
                sql`${properties.price} ASC`,
              ) as typeof baseQuery;
              break;
            case "price_desc":
              finalQuery = baseQuery.orderBy(
                sql`${properties.price} DESC`,
              ) as typeof baseQuery;
              break;
            case "living_area_desc":
              finalQuery = baseQuery.orderBy(
                sql`${properties.livingArea} DESC NULLS LAST`,
              ) as typeof baseQuery;
              break;
            case "living_area_asc":
              finalQuery = baseQuery.orderBy(
                sql`${properties.livingArea} ASC NULLS LAST`,
              ) as typeof baseQuery;
              break;
            case "plot_area_desc":
              finalQuery = baseQuery.orderBy(
                sql`${properties.plotArea} DESC NULLS LAST`,
              ) as typeof baseQuery;
              break;
            case "plot_area_asc":
              finalQuery = baseQuery.orderBy(
                sql`${properties.plotArea} ASC NULLS LAST`,
              ) as typeof baseQuery;
              break;
            case "price_sqm_desc":
              finalQuery = baseQuery.orderBy(
                sql`(CASE WHEN ${properties.livingArea} > 0 THEN ${properties.price} / ${properties.livingArea} ELSE NULL END) ASC NULLS LAST`,
              ) as typeof baseQuery;
              break;
            case "price_sqm_asc":
              finalQuery = baseQuery.orderBy(
                sql`(CASE WHEN ${properties.livingArea} > 0 THEN ${properties.price} / ${properties.livingArea} ELSE NULL END) DESC NULLS LAST`,
              ) as typeof baseQuery;
              break;
            case "rooms_desc":
              finalQuery = baseQuery.orderBy(
                sql`${properties.rooms} DESC NULLS LAST`,
              ) as typeof baseQuery;
              break;
            case "rooms_asc":
              finalQuery = baseQuery.orderBy(
                sql`${properties.rooms} ASC NULLS LAST`,
              ) as typeof baseQuery;
              break;
            case "fee_desc":
              finalQuery = baseQuery.orderBy(
                sql`${properties.monthlyFee} ASC NULLS LAST`,
              ) as typeof baseQuery;
              break;
            case "fee_asc":
              finalQuery = baseQuery.orderBy(
                sql`${properties.monthlyFee} DESC NULLS LAST`,
              ) as typeof baseQuery;
              break;
            case "address_desc":
              finalQuery = baseQuery.orderBy(
                sql`${properties.addressStreet} ASC NULLS LAST`,
              ) as typeof baseQuery;
              break;
            case "address_asc":
              finalQuery = baseQuery.orderBy(
                sql`${properties.addressStreet} DESC NULLS LAST`,
              ) as typeof baseQuery;
              break;
            default:
              finalQuery = baseQuery.orderBy(
                sql`${properties.createdAt} DESC`,
              ) as typeof baseQuery;
          }

          const results = await finalQuery;

          return {
            properties: results,
            total: results.length,
          };
        }
      } catch (error) {
        console.error("Error searching properties:", error);
        return {
          properties: [],
          total: 0,
        };
      }
    }),
} satisfies TRPCRouterRecord;

export default propertyRouter;
