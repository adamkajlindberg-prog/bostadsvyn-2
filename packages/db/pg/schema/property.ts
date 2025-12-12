import { sql } from "drizzle-orm";
import {
  bigint,
  check,
  customType,
  decimal,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./user";

// Custom tsvector type for full-text search
const tsvector = customType<{ data: string }>({
  dataType() {
    return "tsvector";
  },
});

export const properties = pgTable(
  "properties",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
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
    searchVector: tsvector("search_vector"),
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

    // Indexes for filtering and sorting
    index("property_status_idx").on(table.status),
    index("property_type_idx").on(table.propertyType),
    index("property_city_idx").on(table.addressCity),
    index("property_price_idx").on(table.price),
    index("property_created_at_idx").on(table.createdAt),
    index("property_ad_tier_idx").on(table.adTier),

    // Composite indexes for common filter combinations
    index("property_status_type_idx").on(table.status, table.propertyType),
    index("property_status_price_idx").on(table.status, table.price),
    index("property_status_city_idx").on(table.status, table.addressCity),
    index("property_status_type_price_idx").on(
      table.status,
      table.propertyType,
      table.price,
    ),

    // Range query indexes
    index("property_living_area_idx").on(table.livingArea),
    index("property_rooms_idx").on(table.rooms),

    // Geospatial queries
    index("property_lat_lng_idx").on(table.latitude, table.longitude),

    // User's properties
    index("property_user_id_idx").on(table.userId),
  ],
);

export type Property = typeof properties.$inferSelect;
export type NewProperty = typeof properties.$inferInsert;

export const propertyFavorites = pgTable(
  "property_favorites",
  {
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
  },
  (table) => [
    index("property_favorites_user_idx").on(table.userId),
    index("property_favorites_property_idx").on(table.propertyId),
    index("property_favorites_user_property_idx").on(
      table.userId,
      table.propertyId,
    ),
  ],
);

export type PropertyFavorite = typeof propertyFavorites.$inferSelect;
export type NewPropertyFavorite = typeof propertyFavorites.$inferInsert;

export const propertyViews = pgTable(
  "property_views",
  {
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
  },
  (table) => [
    index("property_views_property_idx").on(table.propertyId),
    index("property_views_user_idx").on(table.userId),
    index("property_views_created_at_idx").on(table.createdAt),
  ],
);

export type PropertyView = typeof propertyViews.$inferSelect;
export type NewPropertyView = typeof propertyViews.$inferInsert;
