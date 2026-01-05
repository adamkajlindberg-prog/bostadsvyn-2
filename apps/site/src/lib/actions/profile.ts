"use server";

import { randomUUID } from "node:crypto";
import { eq, getDbClient, user } from "db";
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
  // Note: Preferences table doesn't exist in the schema yet
  // This is a stub implementation that will need to be completed
  // when a user_preferences table is added to the database
  throw new Error(
    "Inställningar är inte implementerade än. En user_preferences tabell behöver läggas till i databasen.",
  );
}

