import { getDbClient, properties, sql } from "db";
import z from "zod/v4";
import { createTRPCRouter, publicProcedure } from "@/trpc/init";

const propertySearch = createTRPCRouter({
  search: publicProcedure
    .input(
      z.object({
        query: z.string().min(1, "Search query is required"),
      }),
    )
    .query(async ({ input }) => {
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
          ) @@ websearch_to_tsquery('swedish', ${input.query})`,
        );

      return {
        properties: results,
        total: results.length,
      };
    }),
});

export default propertySearch;
