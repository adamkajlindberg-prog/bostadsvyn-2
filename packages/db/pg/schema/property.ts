import { sql } from "drizzle-orm";
import {
  bigint,
  check,
  decimal,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./user";

export const properties = pgTable(
  "properties",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    objectId: varchar("object_id", { length: 100 }).notNull().unique(),
    title: text("title").notNull(),
    description: text("description"),
    propertyType: varchar("property_type", { length: 50 }).notNull(),
    status: varchar("status", { length: 20 }).notNull().default("FOR_SALE"),
    price: bigint("price", { mode: "number" }).notNull(),
    addressStreet: text("address_street").notNull(),
    addressPostalCode: text("address_postal_code").notNull(),
    addressCity: text("address_city").notNull(),
    addressCountry: text("address_country").notNull().default("SE"),
    livingArea: integer("living_area"),
    plotArea: integer("plot_area"),
    rooms: integer("rooms"),
    bedrooms: integer("bedrooms"),
    bathrooms: integer("bathrooms"),
    yearBuilt: integer("year_built"),
    energyClass: varchar("energy_class", { length: 1 }),
    monthlyFee: integer("monthly_fee"),
    images: text("images").array(),
    features: text("features").array(),
    latitude: decimal("latitude", { precision: 10, scale: 8 }),
    longitude: decimal("longitude", { precision: 11, scale: 8 }),
    floorPlanUrl: text("floor_plan_url"),
    energyDeclarationUrl: text("energy_declaration_url"),
    operatingCosts: integer("operating_costs"),
    kitchenDescription: text("kitchen_description"),
    bathroomDescription: text("bathroom_description"),
    propertyDocuments: jsonb("property_documents"),
    rentalInfo: jsonb("rental_info"),
    threedTourUrl: text("threed_tour_url"),
    adTier: varchar("ad_tier", { length: 20 }).notNull().default("free"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      "property_type_check",
      sql`${table.propertyType} IN ('HOUSE', 'APARTMENT', 'COTTAGE', 'PLOT', 'FARM', 'COMMERCIAL')`,
    ),
    check(
      "status_check",
      sql`${table.status} IN ('COMING_SOON', 'FOR_SALE', 'SOLD', 'FOR_RENT', 'RENTED', 'DRAFT')`,
    ),
    check(
      "energy_class_check",
      sql`${table.energyClass} IN ('A', 'B', 'C', 'D', 'E', 'F', 'G') OR ${table.energyClass} IS NULL`,
    ),
    check("ad_tier_check", sql`${table.adTier} IN ('free', 'plus', 'premium')`),

    // index("property_search_index").using(
    //   "gin",
    //   sql`(
    //   to_tsvector('swedish',
    //     ${table.title} || ' ' ||
    //     COALESCE(${table.description}, '') || ' ' ||
    //     ${table.propertyType} || ' ' ||
    //     ${table.status} || ' ' ||
    //     ${table.price}::text || ' ' ||
    //     ${table.addressStreet} || ' ' ||
    //     ${table.addressCity} || ' ' ||
    //     COALESCE(${table.livingArea}::text, '') || ' ' ||
    //     COALESCE(${table.plotArea}::text, '') || ' ' ||
    //     COALESCE(${table.rooms}::text, '') || ' ' ||
    //     COALESCE(${table.bedrooms}::text, '') || ' ' ||
    //     COALESCE(${table.bathrooms}::text, '') || ' ' ||
    //     COALESCE(${table.yearBuilt}::text, '') || ' ' ||
    //     COALESCE(${table.monthlyFee}::text, '') || ' ' ||
    //     COALESCE(array_to_string(${table.features}, ' '), '') || ' ' ||
    //     COALESCE(${table.operatingCosts}::text, '') || ' ' ||
    //     COALESCE(${table.kitchenDescription}, '') || ' ' ||
    //     COALESCE(${table.bathroomDescription}, '') || ' ' ||
    //     ${table.adTier}
    //   ))`,
    // ),
    // index("property_location_index").using(
    //   "gin",
    //   sql`(
    //       setweight(to_tsvector('swedish', ${table.addressStreet}), 'A') ||
    //       setweight(to_tsvector('swedish', ${table.addressCity}), 'B')
    //   )`,
    // ),
  ],
);

export type Property = typeof properties.$inferSelect;
export type NewProperty = typeof properties.$inferInsert;

export const propertyFavorites = pgTable("property_favorites", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  propertyId: uuid("property_id")
    .notNull()
    .references(() => properties.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type PropertyFavorite = typeof propertyFavorites.$inferSelect;
export type NewPropertyFavorite = typeof propertyFavorites.$inferInsert;

export const propertyViews = pgTable("property_views", {
  id: uuid("id").defaultRandom().primaryKey(),
  propertyId: uuid("property_id")
    .notNull()
    .references(() => properties.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 255 }).references(() => user.id, {
    onDelete: "set null",
  }),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type PropertyView = typeof propertyViews.$inferSelect;
export type NewPropertyView = typeof propertyViews.$inferInsert;
