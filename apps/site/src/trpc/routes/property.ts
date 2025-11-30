import type { TRPCRouterRecord } from "@trpc/server";
import { getDbClient, properties } from "db";
import { z } from "zod/v4";
import { publicProcedure } from "@/trpc/init";

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

const propertyRouter = {
  search: publicProcedure
    .input(zPropertySearchInput)
    .query(async ({ input: _input }) => {
      try {
        const db = getDbClient();

        console.log(
          "[property-search] Returning all properties (filtering disabled)",
        );

        const results = await db.select().from(properties);

        console.log(`[property-search] Found ${results.length} properties`);

        // Debug: Log first property's images to see what we're getting
        if (results.length > 0) {
          const firstProperty = results[0];
          console.log(`[property-search] Sample property images:`, {
            propertyId: firstProperty?.id,
            images: firstProperty?.images,
            imagesType: typeof firstProperty?.images,
            imagesLength: Array.isArray(firstProperty?.images)
              ? firstProperty.images.length
              : "not an array",
          });
        }

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
} satisfies TRPCRouterRecord;

export default propertyRouter;
