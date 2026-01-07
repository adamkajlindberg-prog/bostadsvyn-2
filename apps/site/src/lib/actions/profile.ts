"use server";

import { randomUUID } from "node:crypto";
import { and, eq, getDbClient, user, account, userPreferences } from "db";
import { getServerSession } from "@/auth/server-session";
import { getImageClient, getImageUrl } from "@/image";
import type { Session } from "@/auth/config";

export interface ProfileData {
  user: {
    id: string;
    email: string;
    image: string | undefined;
    name: string | undefined;
  };
  profile: {
    fullName: string | undefined;
    phone: string | undefined;
    bio: string | undefined;
    companyName: string | undefined;
    avatarUrl: string | undefined;
  };
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    marketingEmails: boolean;
    preferredCurrency: "SEK" | "EUR" | "USD";
    preferredLanguage: "sv" | "en";
    theme: "system" | "light" | "dark";
  };
  roles: string[];
}

export interface UpdateProfileInput {
  fullName: string;
  phone?: string;
  bio?: string;
  companyName?: string;
}

export interface UpdatePreferencesInput {
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  preferredCurrency: "SEK" | "EUR" | "USD";
  preferredLanguage: "sv" | "en";
  theme: "system" | "light" | "dark";
}

export interface AIPreferences {
  interestedAreas: string[];
  budgetRange: { min: number | null; max: number | null };
  preferredPropertyTypes: string[];
  investmentGoals: string[];
  notifications: {
    priceAlerts: boolean;
    marketUpdates: boolean;
    newListings: boolean;
  };
}

export interface UpdateAIPreferencesInput {
  interestedAreas?: string[];
  budgetRange?: { min: number | null; max: number | null };
  preferredPropertyTypes?: string[];
  investmentGoals?: string[];
  notifications?: {
    priceAlerts?: boolean;
    marketUpdates?: boolean;
    newListings?: boolean;
  };
}

export interface UploadAvatarResult {
  url: string;
}

function assertSession(session: Session | null): Session {
  if (!session?.user?.id) {
    throw new Error("Du måste vara inloggad");
  }
  return session;
}

export async function updateProfileAction(input: UpdateProfileInput): Promise<void> {
  const session = assertSession(await getServerSession());

  try {
    const db = getDbClient();

    // Update user.name (maps to fullName)
    // Note: phone, bio, and companyName fields don't exist in user table yet
    // These will need to be added to the schema in the future
    await db
      .update(user)
      .set({
        name: input.fullName,
      })
      .where(eq(user.id, session.user.id));
  } catch (error) {
    console.error("Error updating profile:", error);
    throw new Error(
      error instanceof Error ? error.message : "Kunde inte uppdatera profilen",
    );
  }
}

export async function uploadAvatarAction(file: File): Promise<UploadAvatarResult> {
  const session = assertSession(await getServerSession());

  try {
    const client = getImageClient();
    const arrayBuffer = await file.arrayBuffer();
    const ext = file.name?.split(".").pop() || "jpg";
    const key = `avatars/${session.user.id}/${randomUUID()}.${ext}`;

    await client.upload({
      id: key,
      body: arrayBuffer,
      mimeType: file.type || "image/jpeg",
    });

    const imageUrl = getImageUrl(key);

    // Update user.image field with the new avatar URL
    const db = getDbClient();
    await db
      .update(user)
      .set({
        image: imageUrl,
      })
      .where(eq(user.id, session.user.id));

    return { url: imageUrl };
  } catch (error) {
    console.error("Error uploading avatar:", error);
    throw new Error(
      error instanceof Error ? error.message : "Kunde inte ladda upp bild",
    );
  }
}

export async function updatePreferencesAction(
  input: UpdatePreferencesInput,
): Promise<void> {
  const session = assertSession(await getServerSession());

  try {
    const db = getDbClient();

    // Upsert user preferences
    // First check if preferences exist
    const existing = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, session.user.id))
      .limit(1);

    if (existing.length > 0) {
      // Update existing preferences
      await db
        .update(userPreferences)
        .set({
          emailNotifications: input.emailNotifications,
          smsNotifications: input.smsNotifications,
          marketingEmails: input.marketingEmails,
          preferredCurrency: input.preferredCurrency,
          preferredLanguage: input.preferredLanguage,
          theme: input.theme,
          updatedAt: new Date(),
        })
        .where(eq(userPreferences.userId, session.user.id));
    } else {
      // Insert new preferences
      await db.insert(userPreferences).values({
        id: randomUUID(),
        userId: session.user.id,
        emailNotifications: input.emailNotifications,
        smsNotifications: input.smsNotifications,
        marketingEmails: input.marketingEmails,
        preferredCurrency: input.preferredCurrency,
        preferredLanguage: input.preferredLanguage,
        theme: input.theme,
      });
    }
  } catch (error) {
    console.error("Error updating preferences:", error);
    throw new Error(
      error instanceof Error ? error.message : "Kunde inte uppdatera inställningar",
    );
  }
}

export async function checkBankIDStatus(): Promise<{
  success: boolean;
  isVerified: boolean;
}> {
  const session = assertSession(await getServerSession());

  try {
    const db = getDbClient();

    // Check if user has an account with provider "idura" (BankID)
    const bankIdAccount = await db
      .select()
      .from(account)
      .where(
        and(
          eq(account.userId, session.user.id),
          eq(account.providerId, "idura"),
        ),
      )
      .limit(1);

    return {
      success: true,
      isVerified: bankIdAccount.length > 0,
    };
  } catch (error) {
    console.error("Error checking BankID status:", error);
    return {
      success: false,
      isVerified: false,
    };
  }
}

export async function deleteUserAccount(): Promise<{
  success: boolean;
  error?: string;
}> {
  const session = assertSession(await getServerSession());

  try {
    const db = getDbClient();

    // Delete user - cascade deletes will handle related data
    // (userPreferences, account, etc. all have onDelete: cascade)
    await db.delete(user).where(eq(user.id, session.user.id));

    return { success: true };
  } catch (error) {
    console.error("Error deleting user account:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Kunde inte radera kontot",
    };
  }
}

export async function getUserPreferences(): Promise<{
  success: boolean;
  preferences?: UpdatePreferencesInput;
}> {
  const session = assertSession(await getServerSession());

  try {
    const db = getDbClient();

    const prefs = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, session.user.id))
      .limit(1);

    if (prefs.length === 0) {
      // Return defaults if no preferences exist
      return {
        success: true,
        preferences: {
          emailNotifications: true,
          smsNotifications: false,
          marketingEmails: false,
          preferredCurrency: "SEK",
          preferredLanguage: "sv",
          theme: "system",
        },
      };
    }

    const pref = prefs[0];
    return {
      success: true,
      preferences: {
        emailNotifications: pref.emailNotifications,
        smsNotifications: pref.smsNotifications,
        marketingEmails: pref.marketingEmails,
        preferredCurrency:
          (pref.preferredCurrency as "SEK" | "EUR" | "USD") || "SEK",
        preferredLanguage:
          (pref.preferredLanguage as "sv" | "en") || "sv",
        theme: (pref.theme as "system" | "light" | "dark") || "system",
      },
    };
  } catch (error) {
    console.error("Error getting user preferences:", error);
    return {
      success: false,
    };
  }
}

export async function updateUserPreferences(
  input: UpdatePreferencesInput,
): Promise<{ success: boolean; error?: string }> {
  const session = assertSession(await getServerSession());

  try {
    const db = getDbClient();

    // Upsert user preferences
    // First check if preferences exist
    const existing = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, session.user.id))
      .limit(1);

    if (existing.length > 0) {
      // Update existing preferences
      await db
        .update(userPreferences)
        .set({
          emailNotifications: input.emailNotifications,
          smsNotifications: input.smsNotifications,
          marketingEmails: input.marketingEmails,
          preferredCurrency: input.preferredCurrency,
          preferredLanguage: input.preferredLanguage,
          theme: input.theme,
          updatedAt: new Date(),
        })
        .where(eq(userPreferences.userId, session.user.id));
    } else {
      // Insert new preferences
      await db.insert(userPreferences).values({
        id: randomUUID(),
        userId: session.user.id,
        emailNotifications: input.emailNotifications,
        smsNotifications: input.smsNotifications,
        marketingEmails: input.marketingEmails,
        preferredCurrency: input.preferredCurrency,
        preferredLanguage: input.preferredLanguage,
        theme: input.theme,
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating user preferences:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Kunde inte uppdatera inställningar",
    };
  }
}

export async function updateUserProfile(input: {
  name: string;
  phone?: string;
}): Promise<{ success: boolean; error?: string }> {
  const session = assertSession(await getServerSession());

  try {
    const db = getDbClient();

    await db
      .update(user)
      .set({
        name: input.name,
        phone: input.phone || null,
      })
      .where(eq(user.id, session.user.id));

    return { success: true };
  } catch (error) {
    console.error("Error updating user profile:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Kunde inte uppdatera profilen",
    };
  }
}

export async function getAIPreferences(): Promise<{
  success: boolean;
  preferences?: AIPreferences;
}> {
  const session = assertSession(await getServerSession());

  try {
    const db = getDbClient();

    const prefs = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, session.user.id))
      .limit(1);

    const defaults: AIPreferences = {
      interestedAreas: [],
      budgetRange: { min: null, max: null },
      preferredPropertyTypes: [],
      investmentGoals: [],
      notifications: {
        priceAlerts: false,
        marketUpdates: false,
        newListings: false,
      },
    };

    if (prefs.length === 0) {
      return {
        success: true,
        preferences: defaults,
      };
    }

    const pref = prefs[0];
    return {
      success: true,
      preferences: {
        interestedAreas: (pref.aiInterestedAreas as string[]) || [],
        budgetRange:
          (pref.aiBudgetRange as { min: number | null; max: number | null }) ||
          { min: null, max: null },
        preferredPropertyTypes:
          (pref.aiPreferredPropertyTypes as string[]) || [],
        investmentGoals: (pref.aiInvestmentGoals as string[]) || [],
        notifications:
          (pref.aiNotifications as {
            priceAlerts: boolean;
            marketUpdates: boolean;
            newListings: boolean;
          }) || {
            priceAlerts: false,
            marketUpdates: false,
            newListings: false,
          },
      },
    };
  } catch (error) {
    console.error("Error getting AI preferences:", error);
    return {
      success: false,
    };
  }
}

export async function updateAIPreferences(
  input: UpdateAIPreferencesInput,
): Promise<{ success: boolean; error?: string }> {
  const session = assertSession(await getServerSession());

  try {
    const db = getDbClient();

    // First get existing preferences to merge
    const existing = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, session.user.id))
      .limit(1);

    const defaults: AIPreferences = {
      interestedAreas: [],
      budgetRange: { min: null, max: null },
      preferredPropertyTypes: [],
      investmentGoals: [],
      notifications: {
        priceAlerts: false,
        marketUpdates: false,
        newListings: false,
      },
    };

    const currentPreferences: AIPreferences =
      existing.length > 0
        ? {
            interestedAreas:
              (existing[0].aiInterestedAreas as string[]) || [],
            budgetRange:
              (existing[0].aiBudgetRange as {
                min: number | null;
                max: number | null;
              }) || { min: null, max: null },
            preferredPropertyTypes:
              (existing[0].aiPreferredPropertyTypes as string[]) || [],
            investmentGoals:
              (existing[0].aiInvestmentGoals as string[]) || [],
            notifications:
              (existing[0].aiNotifications as {
                priceAlerts: boolean;
                marketUpdates: boolean;
                newListings: boolean;
              }) || {
                priceAlerts: false,
                marketUpdates: false,
                newListings: false,
              },
          }
        : defaults;

    // Merge input with current preferences
    const updatedPreferences: AIPreferences = {
      interestedAreas:
        input.interestedAreas ?? currentPreferences.interestedAreas,
      budgetRange: input.budgetRange ?? currentPreferences.budgetRange,
      preferredPropertyTypes:
        input.preferredPropertyTypes ?? currentPreferences.preferredPropertyTypes,
      investmentGoals:
        input.investmentGoals ?? currentPreferences.investmentGoals,
      notifications: input.notifications
        ? {
            ...currentPreferences.notifications,
            ...input.notifications,
          }
        : currentPreferences.notifications,
    };

    if (existing.length > 0) {
      // Update existing preferences
      await db
        .update(userPreferences)
        .set({
          aiInterestedAreas: updatedPreferences.interestedAreas,
          aiBudgetRange: updatedPreferences.budgetRange,
          aiPreferredPropertyTypes: updatedPreferences.preferredPropertyTypes,
          aiInvestmentGoals: updatedPreferences.investmentGoals,
          aiNotifications: updatedPreferences.notifications,
          updatedAt: new Date(),
        })
        .where(eq(userPreferences.userId, session.user.id));
    } else {
      // Insert new preferences (user preferences must exist first)
      await db.insert(userPreferences).values({
        id: randomUUID(),
        userId: session.user.id,
        emailNotifications: true,
        smsNotifications: false,
        marketingEmails: false,
        preferredCurrency: "SEK",
        preferredLanguage: "sv",
        theme: "system",
        aiInterestedAreas: updatedPreferences.interestedAreas,
        aiBudgetRange: updatedPreferences.budgetRange,
        aiPreferredPropertyTypes: updatedPreferences.preferredPropertyTypes,
        aiInvestmentGoals: updatedPreferences.investmentGoals,
        aiNotifications: updatedPreferences.notifications,
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error updating AI preferences:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Kunde inte uppdatera AI-inställningar",
    };
  }
}

