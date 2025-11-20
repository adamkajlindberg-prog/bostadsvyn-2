import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { properties } from "./property";
import { user } from "./user";

export const ads = pgTable("ads", {
  id: uuid("id").defaultRandom().primaryKey(),
  propertyId: uuid("property_id")
    .notNull()
    .references(() => properties.id, { onDelete: "cascade" }),
  adTier: varchar("ad_tier", { length: 20 }).notNull().default("free"),
  title: text("title").notNull(),
  description: text("description"),
  customImageUrl: text("custom_image_url"),
  aiGeneratedImageUrl: text("ai_generated_image_url"),
  priorityScore: integer("priority_score").notNull().default(0),
  isFeatured: boolean("is_featured").notNull().default(false),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  brokerFormData: text("broker_form_data"), // JSON stored as text, can be parsed
  moderationStatus: varchar("moderation_status", { length: 50 })
    .notNull()
    .default("pending"),
  moderatedAt: timestamp("moderated_at", { withTimezone: true }),
  moderatedBy: varchar("moderated_by", { length: 255 }).references(
    () => user.id,
    { onDelete: "set null" },
  ),
  moderationNotes: text("moderation_notes"),
  sellerApprovedAt: timestamp("seller_approved_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export type Ad = typeof ads.$inferSelect;
export type NewAd = typeof ads.$inferInsert;

export const adTierFeatures = pgTable("ad_tier_features", {
  id: uuid("id").defaultRandom().primaryKey(),
  adTier: varchar("ad_tier", { length: 20 }).notNull(),
  featureName: text("feature_name").notNull(),
  featureDescription: text("feature_description"),
  isEnabled: boolean("is_enabled").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type AdTierFeature = typeof adTierFeatures.$inferSelect;
export type NewAdTierFeature = typeof adTierFeatures.$inferInsert;
