import {
  and,
  asc,
  desc,
  eq,
  getDbClient,
  gte,
  ilike,
  lte,
  ne,
  or,
  properties,
} from "db";
import { z } from "zod/v4";
import { createTRPCRouter, publicProcedure } from "@/trpc/init";

const zPropertySearchInput = z.object({
  query: z.string().optional(),
  propertyType: z.string().optional(),
  listingType: z.string().optional(), // FOR_SALE, FOR_RENT, or all
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

const propertyRouter = createTRPCRouter({
  search: publicProcedure
    .input(zPropertySearchInput)
    .query(async ({ input }) => {
      try {
        const db = getDbClient();

        let query = db.select().from(properties);

        // Build conditions array
        const conditions = [];

        // Filter by listing type (status)
        if (input.listingType && input.listingType !== "all") {
          conditions.push(eq(properties.status, input.listingType));
        }

        // Filter by property type
        if (input.propertyType) {
          conditions.push(eq(properties.propertyType, input.propertyType));
        }

        // Filter by price (for sale properties)
        if (input.minPrice !== undefined) {
          conditions.push(gte(properties.price, input.minPrice));
        }
        if (input.maxPrice !== undefined) {
          conditions.push(lte(properties.price, input.maxPrice));
        }

        // Filter by rent (for rental properties)
        if (input.minRent !== undefined) {
          conditions.push(gte(properties.price, input.minRent));
        }
        if (input.maxRent !== undefined) {
          conditions.push(lte(properties.price, input.maxRent));
        }

        // Filter by area
        if (input.minArea !== undefined && input.minArea > 0) {
          conditions.push(gte(properties.livingArea, input.minArea));
        }
        if (input.maxArea !== undefined && input.maxArea < 10000) {
          conditions.push(lte(properties.livingArea, input.maxArea));
        }

        // Filter by rooms
        if (input.minRooms !== undefined && input.minRooms > 0) {
          conditions.push(gte(properties.rooms, input.minRooms));
        }
        if (input.maxRooms !== undefined && input.maxRooms < 20) {
          conditions.push(lte(properties.rooms, input.maxRooms));
        }

        // Filter by city
        if (input.city) {
          conditions.push(ilike(properties.addressCity, `%${input.city}%`));
        }

        // Filter by query (search in title, city, street)
        if (input.query) {
          const queryCondition = or(
            ilike(properties.title, `%${input.query}%`),
            ilike(properties.addressCity, `%${input.query}%`),
            ilike(properties.addressStreet, `%${input.query}%`),
          );
          if (queryCondition) {
            conditions.push(queryCondition);
          }
        }

        // Apply conditions
        if (conditions.length > 0) {
          query = query.where(and(...conditions)) as typeof query;
        }

        // Apply sorting
        if (input.sortBy) {
          switch (input.sortBy) {
            case "latest":
            case "created_desc":
              query = query.orderBy(desc(properties.createdAt)) as typeof query;
              break;
            case "created_asc":
              query = query.orderBy(asc(properties.createdAt)) as typeof query;
              break;
            case "price_asc":
              query = query.orderBy(asc(properties.price)) as typeof query;
              break;
            case "price_desc":
              query = query.orderBy(desc(properties.price)) as typeof query;
              break;
            case "area_asc":
              query = query.orderBy(asc(properties.livingArea)) as typeof query;
              break;
            case "area_desc":
              query = query.orderBy(
                desc(properties.livingArea),
              ) as typeof query;
              break;
            case "rooms_asc":
              query = query.orderBy(asc(properties.rooms)) as typeof query;
              break;
            case "rooms_desc":
              query = query.orderBy(desc(properties.rooms)) as typeof query;
              break;
            default:
              query = query.orderBy(desc(properties.createdAt)) as typeof query;
          }
        } else {
          query = query.orderBy(desc(properties.createdAt)) as typeof query;
        }

        const results = await query;

        return {
          properties: results,
          total: results.length,
        };
      } catch (error) {
        console.error("[property-search] Error searching properties:", error);
        if (error instanceof Error) {
          console.error("[property-search] Error stack:", error.stack);
        }
        return {
          properties: [],
          total: 0,
        };
      }
    }),

  similar: publicProcedure
    .input(z.object({ propertyId: z.string().uuid() }))
    .query(async ({ input }) => {
      try {
        const db = getDbClient();

        // Fetch the current property
        const [currentProperty] = await db
          .select()
          .from(properties)
          .where(eq(properties.id, input.propertyId))
          .limit(1);

        if (!currentProperty) {
          return {
            properties: [],
            total: 0,
          };
        }

        // Calculate price range (±30%)
        const minPrice = Math.floor(currentProperty.price * 0.7);
        const maxPrice = Math.ceil(currentProperty.price * 1.3);

        // Build conditions for similar properties
        const conditions = [
          // Exclude current property
          ne(properties.id, input.propertyId),
          // Same listing type (status)
          eq(properties.status, currentProperty.status),
          // Same property type
          eq(properties.propertyType, currentProperty.propertyType),
          // Same city
          ilike(properties.addressCity, currentProperty.addressCity),
        ];

        // Add price filters based on listing type
        if (currentProperty.status === "FOR_RENT") {
          // For rentals, use price field as rent
          conditions.push(gte(properties.price, minPrice));
          conditions.push(lte(properties.price, maxPrice));
        } else {
          // For sale properties, use price field
          conditions.push(gte(properties.price, minPrice));
          conditions.push(lte(properties.price, maxPrice));
        }

        // Query similar properties
        const similarProperties = await db
          .select()
          .from(properties)
          .where(and(...conditions))
          .orderBy(desc(properties.createdAt))
          .limit(6);

        return {
          properties: similarProperties,
          total: similarProperties.length,
        };
      } catch (error) {
        console.error(
          "[property-similar] Error fetching similar properties:",
          error,
        );
        if (error instanceof Error) {
          console.error("[property-similar] Error stack:", error.stack);
        }
        return {
          properties: [],
          total: 0,
        };
      }
    }),
});

export default propertyRouter;
