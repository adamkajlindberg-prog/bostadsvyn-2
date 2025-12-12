import { getDbClient, properties, propertyEmbeddings, sql } from "db";
import { and, cosineDistance, desc, gte, ilike, lte, or } from "drizzle-orm";
import { type NextRequest, NextResponse } from "next/server";
import { generateEmbedding } from "@/lib/ai/embedding";

export async function GET(request: NextRequest) {
  const db = getDbClient();
  const searchParams = request.nextUrl.searchParams;

  // Extract query parameters
  const query = searchParams.get("query") || "";
  const searchType = searchParams.get("type") || "text"; // 'text', 'ai', 'hybrid'
  const propertyType = searchParams.get("propertyType");
  const status = searchParams.get("status") || "FOR_SALE";
  const city = searchParams.get("city");
  const minPrice = Number(searchParams.get("minPrice")) || 0;
  const maxPrice = Number(searchParams.get("maxPrice")) || 20000000;
  const minArea = Number(searchParams.get("minArea")) || 0;
  const maxArea = Number(searchParams.get("maxArea")) || 1000;
  const minRooms = Number(searchParams.get("minRooms")) || 0;
  const maxRooms = Number(searchParams.get("maxRooms")) || 10;
  const sortBy = searchParams.get("sortBy") || "created_desc";
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 20;
  const offset = (page - 1) * limit;

  try {
    // FULL-TEXT SEARCH (Swedish text search)
    if (searchType === "text" && query) {
      const results = await db
        .select({
          ...properties,
          rank: sql<number>`ts_rank(${properties.searchVector}, plainto_tsquery('swedish', ${query}))`,
        })
        .from(properties)
        .where(
          and(
            sql`${properties.searchVector} @@ plainto_tsquery('swedish', ${query})`,
            // Additional filters
            ...(propertyType
              ? [sql`${properties.propertyType} = ${propertyType}`]
              : []),
            sql`${properties.status} = ${status}`,
            sql`${properties.price} BETWEEN ${minPrice} AND ${maxPrice}`,
          ),
        )
        .orderBy(
          sql`ts_rank(${properties.searchVector}, plainto_tsquery('swedish', ${query})) DESC`,
        )
        .limit(limit)
        .offset(offset);

      return NextResponse.json({
        properties: results,
        total: results.length,
        searchType: "text",
      });
    }
    // AI SEMANTIC SEARCH (using embeddings)
    if (searchType === "ai" && query) {
      // Generate embedding for the search query
      const queryEmbedding = await generateEmbedding(query);

      const similarity = sql<number>`1 - (${cosineDistance(
        propertyEmbeddings.embedding,
        queryEmbedding,
      )})`;

      const results = await db
        .select({
          property: properties,
          similarity,
        })
        .from(propertyEmbeddings)
        .innerJoin(
          properties,
          sql`${propertyEmbeddings.propertyId} = ${properties.id}`,
        )
        .where(
          and(
            sql`${similarity} > 0.7`, // Similarity threshold
            sql`${properties.status} = ${status}`,
            ...(propertyType
              ? [sql`${properties.propertyType} = ${propertyType}`]
              : []),
            sql`${properties.price} BETWEEN ${minPrice} AND ${maxPrice}`,
          ),
        )
        .orderBy(desc(similarity))
        .limit(limit)
        .offset(offset);

      return NextResponse.json({
        properties: results.map((r) => ({
          ...r.property,
          similarity: r.similarity,
        })),
        total: results.length,
        searchType: "ai",
      });
    }

    // HYBRID SEARCH (combines text + AI + filters)
    if (searchType === "hybrid" && query) {
      const queryEmbedding = await generateEmbedding(query);
      const similarity = sql<number>`1 - (${cosineDistance(
        propertyEmbeddings.embedding,
        queryEmbedding,
      )})`;

      const textRank = sql<number>`ts_rank(${properties.searchVector}, plainto_tsquery('swedish', ${query}))`;

      // Combine text search + semantic search with weighted scoring
      const results = await db
        .select({
          property: properties,
          textScore: textRank,
          semanticScore: similarity,
          combinedScore: sql<number>`(${textRank} * 0.3) + (${similarity} * 0.7)`,
        })
        .from(propertyEmbeddings)
        .innerJoin(
          properties,
          sql`${propertyEmbeddings.propertyId} = ${properties.id}`,
        )
        .where(
          and(
            or(
              sql`${properties.searchVector} @@ plainto_tsquery('swedish', ${query})`,
              sql`${similarity} > 0.7`,
            ),
            sql`${properties.status} = ${status}`,
            ...(propertyType
              ? [sql`${properties.propertyType} = ${propertyType}`]
              : []),
            sql`${properties.price} BETWEEN ${minPrice} AND ${maxPrice}`,
          ),
        )
        .orderBy(sql`(${textRank} * 0.3) + (${similarity} * 0.7) DESC`)
        .limit(limit)
        .offset(offset);

      return NextResponse.json({
        properties: results.map((r) => ({
          ...r.property,
          textScore: r.textScore,
          semanticScore: r.semanticScore,
          combinedScore: r.combinedScore,
        })),
        total: results.length,
        searchType: "hybrid",
      });
    }

    // ================================================================
    // EXAMPLE 4: STRUCTURED FILTER SEARCH (no text query)
    // ================================================================
    const conditions = [];

    if (city) {
      conditions.push(ilike(properties.addressCity, `%${city}%`));
    }

    if (propertyType) {
      conditions.push(sql`${properties.propertyType} = ${propertyType}`);
    }

    conditions.push(sql`${properties.status} = ${status}`);
    conditions.push(gte(properties.price, minPrice));
    conditions.push(lte(properties.price, maxPrice));

    if (minArea > 0) {
      conditions.push(gte(properties.livingArea, minArea));
    }
    if (maxArea < 1000) {
      conditions.push(lte(properties.livingArea, maxArea));
    }

    if (minRooms > 0) {
      conditions.push(gte(properties.rooms, minRooms));
    }
    if (maxRooms < 10) {
      conditions.push(lte(properties.rooms, maxRooms));
    }

    let resultsQuery = db
      .select()
      .from(properties)
      .where(and(...conditions));

    // Apply sorting
    switch (sortBy) {
      case "price_asc":
        resultsQuery = resultsQuery.orderBy(properties.price);
        break;
      case "price_desc":
        resultsQuery = resultsQuery.orderBy(desc(properties.price));
        break;
      case "area_asc":
        resultsQuery = resultsQuery.orderBy(properties.livingArea);
        break;
      case "area_desc":
        resultsQuery = resultsQuery.orderBy(desc(properties.livingArea));
        break;
      case "created_desc":
      default:
        resultsQuery = resultsQuery.orderBy(desc(properties.createdAt));
    }

    const results = await resultsQuery.limit(limit).offset(offset);

    return NextResponse.json({
      properties: results,
      total: results.length,
      searchType: "filter",
    });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Failed to search properties" },
      { status: 500 },
    );
  }
}
