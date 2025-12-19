"use server";

import { randomUUID } from "node:crypto";
import {
  account,
  and,
  eq,
  getDbClient,
  type UserPreferences,
  user,
  userPreferences,
} from "db";
import { z } from "zod";
import { getServerSession } from "@/auth/server-session";

const profileUpdateSchema = z.object({
  name: z.string().min(2, "Namn måste vara minst 2 tecken"),
  phone: z.string().optional(),
});

const userPreferencesSchema = z.object({
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  marketingEmails: z.boolean(),
  preferredCurrency: z.string(),
  preferredLanguage: z.string(),
  theme: z.string(),
});

export async function updateUserProfile(input: {
  name: string;
  phone?: string;
}) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return { success: false, error: "Inte autentiserad" };
    }

    const parsed = profileUpdateSchema.parse(input);
    const db = getDbClient();

    await db
      .update(user)
      .set({
        name: parsed.name,
        phone: parsed.phone || null,
      })
      .where(eq(user.id, session.user.id));

    return { success: true };
  } catch (error) {
    console.error("Error updating user profile:", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0]?.message || "Ogiltig data",
      };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Kunde inte uppdatera profilen",
    };
  }
}

export async function getUserPreferences(): Promise<
  | { success: true; preferences: UserPreferences }
  | { success: false; error: string }
> {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return { success: false, error: "Inte autentiserad" };
    }

    const db = getDbClient();
    const [prefs] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, session.user.id))
      .limit(1);

    if (prefs) {
      return { success: true, preferences: prefs };
    }

    // Create default preferences if none exist
    const defaultPrefs: Omit<UserPreferences, "id" | "createdAt" | "updatedAt"> = {
      userId: session.user.id,
      emailNotifications: true,
      smsNotifications: false,
      marketingEmails: false,
      preferredCurrency: "SEK",
      preferredLanguage: "sv",
      theme: "system",
    };

    const [newPrefs] = await db
      .insert(userPreferences)
      .values({
        id: randomUUID(),
        ...defaultPrefs,
      })
      .returning();

    return { success: true, preferences: newPrefs };
  } catch (error) {
    console.error("Error getting user preferences:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Kunde inte hämta inställningar",
    };
  }
}

export async function updateUserPreferences(
  input: z.infer<typeof userPreferencesSchema>,
) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return { success: false, error: "Inte autentiserad" };
    }

    const parsed = userPreferencesSchema.parse(input);
    const db = getDbClient();

    // Check if preferences exist
    const [existing] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, session.user.id))
      .limit(1);

    if (existing) {
      // Update existing preferences
      await db
        .update(userPreferences)
        .set({
          emailNotifications: parsed.emailNotifications,
          smsNotifications: parsed.smsNotifications,
          marketingEmails: parsed.marketingEmails,
          preferredCurrency: parsed.preferredCurrency,
          preferredLanguage: parsed.preferredLanguage,
          theme: parsed.theme,
        })
        .where(eq(userPreferences.userId, session.user.id));
    } else {
      // Create new preferences
      await db.insert(userPreferences).values({
        id: randomUUID(),
        userId: session.user.id,
        emailNotifications: parsed.emailNotifications,
        smsNotifications: parsed.smsNotifications,
        marketingEmails: parsed.marketingEmails,
        preferredCurrency: parsed.preferredCurrency,
        preferredLanguage: parsed.preferredLanguage,
        theme: parsed.theme,
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating user preferences:", error);
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0]?.message || "Ogiltig data",
      };
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : "Kunde inte spara inställningar",
    };
  }
}

export async function checkBankIDStatus(): Promise<
  | { success: true; isVerified: boolean }
  | { success: false; error: string }
> {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return { success: false, error: "Inte autentiserad" };
    }

    const db = getDbClient();
    const [bankIdAccount] = await db
      .select()
      .from(account)
      .where(
        and(
          eq(account.userId, session.user.id),
          eq(account.providerId, "idura"),
        ),
      )
      .limit(1);

    return { success: true, isVerified: !!bankIdAccount };
  } catch (error) {
    console.error("Error checking BankID status:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Kunde inte kontrollera BankID-status",
    };
  }
}

export async function deleteUserAccount(): Promise<
  | { success: true }
  | { success: false; error: string }
> {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return { success: false, error: "Inte autentiserad" };
    }

    const db = getDbClient();
    // Delete user - this will cascade delete related data via database constraints
    await db.delete(user).where(eq(user.id, session.user.id));

    return { success: true };
  } catch (error) {
    console.error("Error deleting user account:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Kunde inte radera kontot",
    };
  }
}

