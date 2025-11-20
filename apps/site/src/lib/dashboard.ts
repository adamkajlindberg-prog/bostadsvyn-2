import {
  ads,
  desc,
  eq,
  getDbClient,
  type Property,
  properties,
  propertyFavorites,
} from "db";

export interface DashboardStats {
  favoriteCount: number;
  viewCount: number;
  savedSearchCount: number;
  alertCount: number;
  propertyCount?: number;
}

export async function getDashboardStats(
  userId: string,
): Promise<DashboardStats> {
  try {
    const db = getDbClient();

    // Get favorites count
    const favorites = await db
      .select()
      .from(propertyFavorites)
      .where(eq(propertyFavorites.userId, userId));
    const favoriteCount = favorites.length;

    // Get property count if user owns properties
    const userProperties = await db
      .select()
      .from(properties)
      .where(eq(properties.userId, userId));
    const propertyCount = userProperties.length;

    // TODO: Implement saved searches and alerts when schemas are added
    return {
      favoriteCount,
      viewCount: 0, // TODO: Aggregate from property_views
      savedSearchCount: 0, // TODO: Implement saved_searches table
      alertCount: 0, // TODO: Implement property_alerts table
      propertyCount,
    };
  } catch (error) {
    console.error("Error loading dashboard stats:", error);
    return {
      favoriteCount: 0,
      viewCount: 0,
      savedSearchCount: 0,
      alertCount: 0,
      propertyCount: 0,
    };
  }
}

export async function getFavoriteProperties(
  userId: string,
  limit: number = 6,
): Promise<Property[]> {
  try {
    const db = getDbClient();
    const favorites = await db
      .select({
        property: properties,
      })
      .from(propertyFavorites)
      .innerJoin(properties, eq(propertyFavorites.propertyId, properties.id))
      .where(eq(propertyFavorites.userId, userId))
      .orderBy(desc(propertyFavorites.createdAt))
      .limit(limit);

    return favorites.map((f) => f.property);
  } catch (error) {
    console.error("Error loading favorite properties:", error);
    return [];
  }
}

export async function getUserAds(userId: string) {
  try {
    const db = getDbClient();

    // Get all ads for user
    const userAds = await db
      .select({
        ad: ads,
        property: properties,
      })
      .from(ads)
      .innerJoin(properties, eq(ads.propertyId, properties.id))
      .where(eq(ads.userId, userId))
      .orderBy(desc(ads.createdAt));

    const rentalAds = userAds.filter(
      (item) =>
        item.property.status === "FOR_RENT" &&
        item.ad.moderationStatus !== "pending_seller_approval",
    );
    const salesAds = userAds.filter(
      (item) =>
        item.property.status === "FOR_SALE" &&
        item.ad.moderationStatus !== "pending_seller_approval",
    );
    const pendingApprovalAds = userAds.filter(
      (item) =>
        item.ad.moderationStatus === "pending_seller_approval" &&
        item.property.status !== "FOR_RENT",
    );
    const pendingApprovalProjects = userAds.filter(
      (item) => item.ad.moderationStatus === "pending_seller_approval",
    );

    return {
      rentalAds: rentalAds.map((item) => ({
        ...item.ad,
        property: item.property,
      })),
      salesAds: salesAds.map((item) => ({
        ...item.ad,
        property: item.property,
      })),
      pendingApprovalAds: pendingApprovalAds.map((item) => ({
        ...item.ad,
        property: item.property,
      })),
      pendingApprovalProjects: pendingApprovalProjects.map((item) => ({
        ...item.ad,
        property: item.property,
      })),
    };
  } catch (error) {
    console.error("Error loading user ads:", error);
    return {
      rentalAds: [],
      salesAds: [],
      pendingApprovalAds: [],
      pendingApprovalProjects: [],
    };
  }
}
