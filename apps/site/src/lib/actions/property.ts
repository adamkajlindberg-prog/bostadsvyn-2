"use server";

import { randomUUID } from "node:crypto";
import {
  and,
  brokers,
  count,
  desc,
  eq,
  getDbClient,
  gte,
  inArray,
  ilike,
  lt,
  ne,
  or,
  organization,
  type Property,
  properties,
  propertyFavorites,
  propertyViews,
  user,
} from "db";
import { z } from "zod";
import { getServerSession } from "@/auth/server-session";
import { getImageClient } from "@/image";

export async function getPropertyById(id: string): Promise<Property | null> {
  try {
    const db = getDbClient();
    const [property] = await db
      .select()
      .from(properties)
      .where(eq(properties.id, id))
      .limit(1);

    return property || null;
  } catch (error) {
    console.error("Error fetching property:", error);
    return null;
  }
}

// --- Property management helpers ---

const propertyInputSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
  propertyType: z.enum([
    "HOUSE",
    "APARTMENT",
    "COTTAGE",
    "PLOT",
    "FARM",
    "COMMERCIAL",
  ]),
  status: z.enum([
    "COMING_SOON",
    "FOR_SALE",
    "FOR_RENT",
    "SOLD",
    "RENTED",
    "DRAFT",
  ]),
  price: z.number().nonnegative(),
  addressStreet: z.string().min(1),
  addressPostalCode: z.string().min(1),
  addressCity: z.string().min(1),
  livingArea: z.number().optional(),
  plotArea: z.number().optional(),
  rooms: z.number().optional(),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  yearBuilt: z.number().optional(),
  monthlyFee: z.number().optional(),
  energyClass: z.enum(["A", "B", "C", "D", "E", "F", "G"]).optional(),
  features: z.array(z.string()).optional(),
  adTier: z.enum(["free", "plus", "premium"]).default("free"),
  images: z.array(z.string()).optional(),
});

type PropertyInput = z.infer<typeof propertyInputSchema>;

function assertSession(session: Awaited<ReturnType<typeof getServerSession>>) {
  if (!session?.user?.id) {
    throw new Error("Du måste vara inloggad");
  }
  return session;
}

function isPrivileged(session: Awaited<ReturnType<typeof getServerSession>>) {
  const role = session?.user?.role;
  return role === "broker" || role === "admin";
}

async function uploadPropertyImages(files: File[], userId: string) {
  if (!files?.length) return [] as string[];

  const client = getImageClient();
  const uploaded: string[] = [];

  for (const file of files) {
    const arrayBuffer = await file.arrayBuffer();
    const ext = file.name?.split(".").pop() || "jpg";
    const key = `${userId}/${randomUUID()}.${ext}`;
    await client.upload({
      id: `properties/${key}`,
      body: arrayBuffer,
      mimeType: file.type || "application/octet-stream",
    });
    uploaded.push(key);
  }

  return uploaded;
}

export async function createProperty(
  input: PropertyInput,
  images: File[] = [],
) {
  const session = assertSession(await getServerSession());
  const parsed = propertyInputSchema.parse(input);

  try {
    const db = getDbClient();
    const uploaded = await uploadPropertyImages(images, session.user.id);

    await db.insert(properties).values({
      id: parsed.id,
      userId: session.user.id,
      title: parsed.title,
      description: parsed.description,
      propertyType: parsed.propertyType,
      status: parsed.status,
      price: parsed.price,
      addressStreet: parsed.addressStreet,
      addressPostalCode: parsed.addressPostalCode,
      addressCity: parsed.addressCity,
      livingArea: parsed.livingArea,
      plotArea: parsed.plotArea,
      rooms: parsed.rooms,
      bedrooms: parsed.bedrooms,
      bathrooms: parsed.bathrooms,
      yearBuilt: parsed.yearBuilt,
      monthlyFee: parsed.monthlyFee,
      energyClass: parsed.energyClass,
      features: parsed.features,
      images: [...(parsed.images || []), ...uploaded],
      adTier: parsed.adTier,
    });

    return { success: true };
  } catch (error) {
    console.error("Error creating property:", error);
    return { success: false, error: "Kunde inte skapa fastighet" };
  }
}

export async function updateProperty(
  id: string,
  input: PropertyInput,
  images: File[] = [],
) {
  const session = assertSession(await getServerSession());
  const parsed = propertyInputSchema.parse({ ...input, id });

  try {
    const db = getDbClient();

    const [existing] = await db
      .select()
      .from(properties)
      .where(eq(properties.id, id))
      .limit(1);

    if (!existing) {
      return { success: false, error: "Fastighet hittades inte" };
    }

    if (!isPrivileged(session) && existing.userId !== session.user.id) {
      return { success: false, error: "Saknar behörighet" };
    }

    const uploaded = await uploadPropertyImages(images, existing.userId);

    await db
      .update(properties)
      .set({
        title: parsed.title,
        description: parsed.description,
        propertyType: parsed.propertyType,
        status: parsed.status,
        price: parsed.price,
        addressStreet: parsed.addressStreet,
        addressPostalCode: parsed.addressPostalCode,
        addressCity: parsed.addressCity,
        livingArea: parsed.livingArea,
        plotArea: parsed.plotArea,
        rooms: parsed.rooms,
        bedrooms: parsed.bedrooms,
        bathrooms: parsed.bathrooms,
        yearBuilt: parsed.yearBuilt,
        monthlyFee: parsed.monthlyFee,
        energyClass: parsed.energyClass,
        features: parsed.features,
        images: [...(parsed.images || []), ...uploaded],
        adTier: parsed.adTier,
      })
      .where(eq(properties.id, id));

    return { success: true };
  } catch (error) {
    console.error("Error updating property:", error);
    return { success: false, error: "Kunde inte uppdatera fastighet" };
  }
}

export async function deleteProperty(id: string) {
  const session = assertSession(await getServerSession());

  try {
    const db = getDbClient();
    const [existing] = await db
      .select({ userId: properties.userId })
      .from(properties)
      .where(eq(properties.id, id))
      .limit(1);

    if (!existing) {
      return { success: false, error: "Fastighet hittades inte" };
    }

    if (!isPrivileged(session) && existing.userId !== session.user.id) {
      return { success: false, error: "Saknar behörighet" };
    }

    await db.delete(properties).where(eq(properties.id, id));
    return { success: true };
  } catch (error) {
    console.error("Error deleting property:", error);
    return { success: false, error: "Kunde inte ta bort fastighet" };
  }
}

export async function listManagedProperties(params?: {
  search?: string;
  status?: string;
}) {
  const session = assertSession(await getServerSession());
  try {
    const db = getDbClient();
    const filters = [];

    if (!isPrivileged(session)) {
      filters.push(eq(properties.userId, session.user.id));
    }

    // Exclude rental properties (FOR_RENT) from broker portal
    // This matches the lovable behavior
    filters.push(ne(properties.status, "FOR_RENT"));

    if (params?.status && params.status !== "all") {
      filters.push(eq(properties.status, params.status));
    }

    if (params?.search?.trim()) {
      const query = `%${params.search.trim()}%`;
      filters.push(
        or(
          ilike(properties.title, query),
          ilike(properties.addressCity, query),
          ilike(properties.addressStreet, query),
        ),
      );
    }

    const whereClause = filters.length ? and(...filters) : undefined;

    const items = await db
      .select()
      .from(properties)
      .where(whereClause)
      .orderBy(desc(properties.createdAt));

    const propertyIds = items.map((p) => p.id);

    let views = 0;
    let favorites = 0;

    if (propertyIds.length > 0) {
      const [viewCount] = await db
        .select({ count: count() })
        .from(propertyViews)
        .where(inArray(propertyViews.propertyId, propertyIds));

      const [favoriteCount] = await db
        .select({ count: count() })
        .from(propertyFavorites)
        .where(inArray(propertyFavorites.propertyId, propertyIds));

      views = viewCount?.count || 0;
      favorites = favoriteCount?.count || 0;
    }

    const stats = {
      total: items.length,
      active: items.filter((p) =>
        ["FOR_SALE", "FOR_RENT", "COMING_SOON"].includes(p.status),
      ).length,
      sold: items.filter((p) => ["SOLD", "RENTED"].includes(p.status)).length,
      draft: items.filter((p) => p.status === "DRAFT").length,
      views,
      favorites,
    };

    return { success: true, properties: items, stats };
  } catch (error) {
    console.error("Error listing properties:", error);
    return {
      success: false,
      error: "Kunde inte ladda fastigheter",
      properties: [],
      stats: { total: 0, active: 0, sold: 0, draft: 0, views: 0, favorites: 0 },
    };
  }
}

export async function getPropertyOwner(userId: string) {
  try {
    const db = getDbClient();
    const [owner] = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    return owner
      ? {
          id: owner.id,
          fullName: owner.name || null,
          email: owner.email,
          phone: null, // Phone not stored in user table, would need to add if needed
        }
      : null;
  } catch (error) {
    console.error("Error fetching property owner:", error);
    return null;
  }
}

export async function getBrokerInfo(userId: string) {
  try {
    const db = getDbClient();
    const [result] = await db
      .select({
        id: brokers.id,
        brokerName: brokers.brokerName,
        brokerEmail: brokers.brokerEmail,
        brokerPhone: brokers.brokerPhone,
        licenseNumber: brokers.licenseNumber,
        organization: {
          id: organization.id,
          name: organization.name,
          slug: organization.slug,
          logo: organization.logo,
          metadata: organization.metadata,
        },
      })
      .from(brokers)
      .leftJoin(organization, eq(brokers.organizationId, organization.id))
      .where(eq(brokers.userId, userId))
      .limit(1);

    if (!result) {
      return null;
    }

    return result;
  } catch (error) {
    console.error("Error fetching broker info:", error);
    return null;
  }
}

export async function trackPropertyView(
  propertyId: string,
  userAgent?: string,
) {
  try {
    const session = await getServerSession();

    const db = getDbClient();
    await db.insert(propertyViews).values({
      propertyId,
      userId: session?.user?.id || null,
      userAgent: userAgent || null,
      ipAddress: null, // Would need to get from request headers
    });
  } catch (error) {
    // Silent fail for analytics
    console.error("Failed to track view:", error);
  }
}

export async function checkFavoriteStatus(
  propertyId: string,
): Promise<boolean> {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return false;
    }

    const db = getDbClient();
    const [favorite] = await db
      .select()
      .from(propertyFavorites)
      .where(
        and(
          eq(propertyFavorites.userId, session.user.id),
          eq(propertyFavorites.propertyId, propertyId),
        ),
      )
      .limit(1);

    return !!favorite;
  } catch (error) {
    console.error("Error checking favorite status:", error);
    return false;
  }
}

export async function toggleFavorite(propertyId: string): Promise<{
  success: boolean;
  isFavorite: boolean;
  error?: string;
}> {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return {
        success: false,
        isFavorite: false,
        error: "Du måste logga in för att spara favoriter",
      };
    }

    const db = getDbClient();
    const [existing] = await db
      .select()
      .from(propertyFavorites)
      .where(
        and(
          eq(propertyFavorites.userId, session.user.id),
          eq(propertyFavorites.propertyId, propertyId),
        ),
      )
      .limit(1);

    if (existing) {
      await db
        .delete(propertyFavorites)
        .where(eq(propertyFavorites.id, existing.id));
      return { success: true, isFavorite: false };
    } else {
      await db.insert(propertyFavorites).values({
        userId: session.user.id,
        propertyId,
      });
      return { success: true, isFavorite: true };
    }
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return {
      success: false,
      isFavorite: false,
      error: "Kunde inte uppdatera favorit",
    };
  }
}

// Property statistics functions for broker dashboard
export async function getPropertyViewsStats(propertyId: string): Promise<{
  viewsToday: number;
  viewsThisWeek: number;
  viewsTotal: number;
}> {
  try {
    const db = getDbClient();
    const now = new Date();
    
    // Start of today
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    // Start of week (Monday)
    const dayOfWeek = now.getDay();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    weekStart.setHours(0, 0, 0, 0);

    // Get all views
    const allViews = await db
      .select()
      .from(propertyViews)
      .where(eq(propertyViews.propertyId, propertyId));

    const viewsToday = allViews.filter(
      (v) => v.createdAt && new Date(v.createdAt) >= todayStart
    ).length;

    const viewsThisWeek = allViews.filter(
      (v) => v.createdAt && new Date(v.createdAt) >= weekStart
    ).length;

    return {
      viewsToday,
      viewsThisWeek,
      viewsTotal: allViews.length,
    };
  } catch (error) {
    console.error("Error fetching property views stats:", error);
    return { viewsToday: 0, viewsThisWeek: 0, viewsTotal: 0 };
  }
}

export async function getPropertyFavoritesCount(propertyId: string): Promise<number> {
  try {
    const db = getDbClient();
    const [result] = await db
      .select({ count: count() })
      .from(propertyFavorites)
      .where(eq(propertyFavorites.propertyId, propertyId));

    return result?.count || 0;
  } catch (error) {
    console.error("Error fetching favorites count:", error);
    return 0;
  }
}

export async function getPropertyFinalPriceInterest(propertyId: string): Promise<number> {
  // TODO: Implement when final price interest table is added
  // For now, return 0
  return 0;
}

export async function getPropertyAIEditStats(propertyId: string): Promise<{
  aiEditUsers: number;
  aiEditTotal: number;
}> {
  // TODO: Implement when AI edits table is added
  // For now, return 0
  return { aiEditUsers: 0, aiEditTotal: 0 };
}
