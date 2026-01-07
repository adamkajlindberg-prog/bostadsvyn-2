"use server";

import { and, eq, getDbClient, subscription } from "db";
import type { UserTier } from "@/payments/types";

export async function getUserSubscriptionTier(
  userId: string,
): Promise<UserTier> {
  try {
    const db = getDbClient();

    // Get active subscription for user
    const userSubscriptions = await db
      .select()
      .from(subscription)
      .where(
        and(
          eq(subscription.referenceId, userId),
          eq(subscription.status, "active"),
        ),
      )
      .orderBy(subscription.periodEnd)
      .limit(1);

    if (userSubscriptions.length === 0) {
      return "free";
    }

    const sub = userSubscriptions[0];
    const plan = sub.plan.toLowerCase();

    // Map plan to tier
    if (plan.includes("pro_plus") || plan === "pro_plus") {
      return "pro_plus";
    }
    if (plan.includes("pro") || plan === "pro") {
      return "pro";
    }

    return "free";
  } catch (error) {
    console.error("Error getting subscription tier:", error);
    return "free";
  }
}

