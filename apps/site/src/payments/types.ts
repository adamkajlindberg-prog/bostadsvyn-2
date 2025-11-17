export type UserTier = "free" | "pro" | "pro_plus";
export type SubscriptionPricing =
  | "free"
  | "pro-personal-monthly"
  | "pro-company-monthly"
  | "pro_plus-personal-monthly"
  | "pro_plus-company-monthly";
export type AdTierPricing = "free" | "plus-monthly" | "premium-3weeks";
export type Pricing = SubscriptionPricing | AdTierPricing;

import { z } from "zod";

export type Product = {
  id: UserTier;
  name: string;
  desc: string;
  monthlyImages: number | "unlimited";
  monthlyAiEvaluations: number;
};

// Subscription related types
export const zSubscriptionInterval = z.union([
  z.literal("day"),
  z.literal("week"),
  z.literal("month"),
  z.literal("year"),
]);
export type SubscriptionInterval = z.infer<typeof zSubscriptionInterval>;

export const zRecurring = z.object({
  interval: zSubscriptionInterval,
  interval_count: z.number().int(),
});

// Base variant related types
export const zBasePrice = z.object({
  comparePrice: z.optional(z.number()),
  currency: z.literal("sek"),
  id: z.string(),
  name: z.string(),
  price: z.number(),
  productId: z.string(),
});

export type BasePrice = z.infer<typeof zBasePrice>;

// Product variant related types
export const zProductVariant = zBasePrice.extend({
  type: z.literal("one-time"),
});
export type ProductVariant = z.infer<typeof zProductVariant>;

// Subscription variant related types
export const zRecurringVariant = zBasePrice.extend({
  recurring: zRecurring,
  type: z.literal("recurring"),
});

// Variant related types
export const zVariant = z.union([zProductVariant, zRecurringVariant]);
export type Variant = z.infer<typeof zVariant>;
