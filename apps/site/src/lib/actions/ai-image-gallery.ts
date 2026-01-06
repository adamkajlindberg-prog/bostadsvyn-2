"use server";

import {
  desc,
  eq,
  getDbClient,
  userAiEdits,
  type UserAiEdit,
} from "db";
import { getServerSession } from "@/auth/server-session";

function assertSession(
  session: Awaited<ReturnType<typeof getServerSession>>,
) {
  if (!session?.user?.id) {
    throw new Error("Du måste vara inloggad");
  }
  return session;
}

export async function getUserAiEdits(): Promise<{
  success: boolean;
  edits?: UserAiEdit[];
  error?: string;
}> {
  try {
    const session = assertSession(await getServerSession());
    const db = getDbClient();

    const edits = await db
      .select()
      .from(userAiEdits)
      .where(eq(userAiEdits.userId, session.user.id))
      .orderBy(desc(userAiEdits.createdAt));

    return { success: true, edits };
  } catch (error) {
    console.error("Error fetching AI edits:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Kunde inte ladda bildgalleri",
    };
  }
}

export async function toggleFavoriteAiEdit(
  id: string,
  currentFavorite: boolean,
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = assertSession(await getServerSession());
    const db = getDbClient();

    // Verify the edit belongs to the user
    const [edit] = await db
      .select()
      .from(userAiEdits)
      .where(eq(userAiEdits.id, id))
      .limit(1);

    if (!edit) {
      return { success: false, error: "Redigering hittades inte" };
    }

    if (edit.userId !== session.user.id) {
      return {
        success: false,
        error: "Du har inte behörighet att ändra denna redigering",
      };
    }

    await db
      .update(userAiEdits)
      .set({ isFavorite: !currentFavorite })
      .where(eq(userAiEdits.id, id));

    return { success: true };
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Kunde inte uppdatera favorit",
    };
  }
}

export async function deleteAiEdit(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = assertSession(await getServerSession());
    const db = getDbClient();

    // Verify the edit belongs to the user
    const [edit] = await db
      .select()
      .from(userAiEdits)
      .where(eq(userAiEdits.id, id))
      .limit(1);

    if (!edit) {
      return { success: false, error: "Redigering hittades inte" };
    }

    if (edit.userId !== session.user.id) {
      return {
        success: false,
        error: "Du har inte behörighet att ta bort denna redigering",
      };
    }

    await db.delete(userAiEdits).where(eq(userAiEdits.id, id));

    return { success: true };
  } catch (error) {
    console.error("Error deleting edit:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Kunde inte ta bort redigering",
    };
  }
}

