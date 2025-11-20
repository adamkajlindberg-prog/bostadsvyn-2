"use server";

import {
  and,
  brokerOffices,
  brokers,
  eq,
  getDbClient,
  type Property,
  properties,
  propertyFavorites,
  propertyViews,
  user,
} from "db";
import { getServerSession } from "@/auth/server-session";

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
    const [broker] = await db
      .select({
        id: brokers.id,
        brokerName: brokers.brokerName,
        brokerEmail: brokers.brokerEmail,
        brokerPhone: brokers.brokerPhone,
        licenseNumber: brokers.licenseNumber,
      })
      .from(brokers)
      .where(eq(brokers.userId, userId))
      .limit(1);

    if (!broker) {
      return null;
    }

    const [office] = await db
      .select()
      .from(brokerOffices)
      .where(eq(brokerOffices.brokerId, broker.id))
      .limit(1);

    return {
      ...broker,
      office: office || null,
    };
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
