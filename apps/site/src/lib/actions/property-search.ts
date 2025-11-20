"use server";

import {
  and,
  asc,
  desc,
  eq,
  getDbClient,
  gte,
  ilike,
  inArray,
  lte,
  or,
  type Property,
  properties,
  sql,
} from "db";

export interface PropertySearchFilters {
  query?: string;
  propertyType?: string;
  listingType?: string; // FOR_SALE, FOR_RENT, or all
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  minRooms?: number;
  maxRooms?: number;
  city?: string;
  features?: string[];
  energyClass?: string[];
  sortBy?: string;
  minRent?: number;
  maxRent?: number;
  minMonthlyFee?: number;
  maxMonthlyFee?: number;
  minPlotArea?: number;
  maxPlotArea?: number;
}

export interface PropertySearchResult {
  properties: Property[];
  total: number;
}

export async function searchProperties(
  filters: PropertySearchFilters,
): Promise<PropertySearchResult> {
  try {
    const db = getDbClient();

    // Build where conditions
    const conditions = [];

    // Status filter
    if (filters.listingType && filters.listingType !== "all") {
      conditions.push(eq(properties.status, filters.listingType));
    }

    // Price filter
    if (filters.minPrice !== undefined) {
      conditions.push(gte(properties.price, filters.minPrice));
    }
    if (filters.maxPrice !== undefined) {
      conditions.push(lte(properties.price, filters.maxPrice));
    }

    // Area filter
    if (filters.minArea !== undefined && properties.livingArea) {
      conditions.push(gte(properties.livingArea, filters.minArea));
    }
    if (filters.maxArea !== undefined && properties.livingArea) {
      conditions.push(lte(properties.livingArea, filters.maxArea));
    }

    // Rooms filter
    if (filters.minRooms !== undefined && properties.rooms) {
      conditions.push(gte(properties.rooms, filters.minRooms));
    }
    if (filters.maxRooms !== undefined && properties.rooms) {
      conditions.push(lte(properties.rooms, filters.maxRooms));
    }

    // Property type filter
    if (filters.propertyType) {
      conditions.push(eq(properties.propertyType, filters.propertyType));
    }

    // City filter
    if (filters.city) {
      conditions.push(ilike(properties.addressCity, `%${filters.city}%`));
    }

    // Query filter (search in title, description, address)
    if (filters.query) {
      const queryCondition = or(
        ilike(properties.title, `%${filters.query}%`),
        ilike(properties.description || sql`''`, `%${filters.query}%`),
        ilike(properties.addressStreet, `%${filters.query}%`),
        ilike(properties.addressCity, `%${filters.query}%`),
        // biome-ignore lint/suspicious/noExplicitAny: Type assertion needed due to Drizzle ORM type system complexity
      ) as any;
      conditions.push(queryCondition);
    }

    // Energy class filter
    if (filters.energyClass && filters.energyClass.length > 0) {
      const energyCondition = inArray(
        properties.energyClass || sql`NULL`,
        filters.energyClass,
        // biome-ignore lint/suspicious/noExplicitAny: Type assertion needed due to Drizzle ORM type system complexity
      ) as any;
      conditions.push(energyCondition);
    }

    // Monthly fee filter
    if (filters.minMonthlyFee !== undefined && properties.monthlyFee) {
      conditions.push(gte(properties.monthlyFee, filters.minMonthlyFee));
    }
    if (filters.maxMonthlyFee !== undefined && properties.monthlyFee) {
      conditions.push(lte(properties.monthlyFee, filters.maxMonthlyFee));
    }

    // Plot area filter
    if (filters.minPlotArea !== undefined && properties.plotArea) {
      conditions.push(gte(properties.plotArea, filters.minPlotArea));
    }
    if (filters.maxPlotArea !== undefined && properties.plotArea) {
      conditions.push(lte(properties.plotArea, filters.maxPlotArea));
    }

    // Build query
    // biome-ignore lint/suspicious/noExplicitAny: Dynamic query building requires flexible typing
    let query: any = db.select().from(properties);

    if (conditions.length > 0) {
      // biome-ignore lint/suspicious/noExplicitAny: Type assertion needed for dynamic where conditions
      query = query.where(and(...conditions) as any);
    }

    // Apply sorting
    const sortBy = filters.sortBy || "created_desc";
    switch (sortBy) {
      case "created_desc":
        query = query.orderBy(desc(properties.createdAt));
        break;
      case "created_asc":
        query = query.orderBy(asc(properties.createdAt));
        break;
      case "price_asc":
        query = query.orderBy(asc(properties.price));
        break;
      case "price_desc":
        query = query.orderBy(desc(properties.price));
        break;
      case "area_desc":
        query = query.orderBy(desc(properties.livingArea || sql`0`));
        break;
      case "area_asc":
        query = query.orderBy(asc(properties.livingArea || sql`0`));
        break;
      default:
        query = query.orderBy(desc(properties.createdAt));
    }

    const results = await query;

    return {
      properties: results,
      total: results.length,
    };
  } catch (error) {
    console.error("Error searching properties:", error);
    return {
      properties: [],
      total: 0,
    };
  }
}
