import type { Pricing, Variant } from "./types";

export const prices: Record<Pricing, Variant> = {
  // Subscription tiers
  free: {
    currency: "sek",
    id: "free",
    name: "Free",
    price: 0,
    productId: "free",
    recurring: {
      interval: "month",
      interval_count: 1,
    },
    type: "recurring",
  },
  "pro-personal-monthly": {
    currency: "sek",
    id: "pro-personal-monthly",
    name: "Pro Personal - 1 Month",
    price: 299,
    productId: "pro",
    recurring: {
      interval: "month",
      interval_count: 1,
    },
    type: "recurring",
  },
  "pro-company-monthly": {
    currency: "sek",
    id: "pro-company-monthly",
    name: "Pro Company - 1 Month",
    price: 499,
    productId: "pro",
    recurring: {
      interval: "month",
      interval_count: 1,
    },
    type: "recurring",
  },
  "pro_plus-personal-monthly": {
    currency: "sek",
    id: "pro_plus-personal-monthly",
    name: "Pro+ Personal - 1 Month",
    price: 499,
    productId: "pro_plus",
    recurring: {
      interval: "month",
      interval_count: 1,
    },
    type: "recurring",
  },
  "pro_plus-company-monthly": {
    currency: "sek",
    id: "pro_plus-company-monthly",
    name: "Pro+ Company - 1 Month",
    price: 699,
    productId: "pro_plus",
    recurring: {
      interval: "month",
      interval_count: 1,
    },
    type: "recurring",
  },
  // Ad tiers
  "plus-monthly": {
    currency: "sek",
    id: "plus-monthly",
    name: "Pluspaket - 1 Month",
    price: 1995,
    productId: "plus",
    recurring: {
      interval: "month",
      interval_count: 1,
    },
    type: "recurring",
  },
  "premium-3weeks": {
    currency: "sek",
    id: "premium-3weeks",
    name: "Exklusivpaket - 3 Weeks",
    price: 3995,
    productId: "premium",
    recurring: {
      interval: "week",
      interval_count: 3,
    },
    type: "recurring",
  },
};
