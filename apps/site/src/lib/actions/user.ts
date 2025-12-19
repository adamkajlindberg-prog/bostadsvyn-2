"use server";

import { eq, getDbClient, user } from "db";
import { z } from "zod";
import { getServerSession } from "@/auth/server-session";

const updateAccountTypeSchema = z.object({
  accountType: z.enum(["buyer", "company"]),
  companyName: z.string().optional(),
  orgNumber: z.string().optional(),
});

export type UpdateAccountTypeInput = z.infer<typeof updateAccountTypeSchema>;

export async function updateUserAccountType(
  input: UpdateAccountTypeInput,
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getServerSession();

    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    const validated = updateAccountTypeSchema.parse(input);

    // Validate that company fields are provided when accountType is 'company'
    if (validated.accountType === "company") {
      if (!validated.companyName || validated.companyName.trim() === "") {
        return { success: false, error: "Company name is required" };
      }
      if (!validated.orgNumber || validated.orgNumber.trim() === "") {
        return { success: false, error: "Organization number is required" };
      }
    }

    const db = getDbClient();

    await db
      .update(user)
      .set({
        accountType: validated.accountType,
        companyName: validated.companyName || null,
        orgNumber: validated.orgNumber || null,
      })
      .where(eq(user.id, session.user.id));

    return { success: true };
  } catch (error) {
    console.error("Error updating user account type:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

