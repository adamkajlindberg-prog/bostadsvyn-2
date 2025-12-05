import {
  index,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  vector,
} from "drizzle-orm/pg-core";
import { env } from "../../env";

export const hittaMaklare = pgTable(
  "hitta_maklare",
  {
    id: serial("id").primaryKey(),
    embedding: vector("embedding", {
      dimensions: env.EMBEDDING_DIMENSIONALITY,
    }).notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    realEstateAgency: varchar("real_estate_agency", { length: 100 }).notNull(),
    office: varchar("office", { length: 100 }).notNull(),
    telephone: varchar("telephone", { length: 50 }),
    email: varchar("email", { length: 100 }),
    streetAddress: varchar("street_address", { length: 200 }),
    addressLocality: varchar("address_locality", { length: 100 }),
    addressCountry: varchar("address_country", { length: 100 }),
    postalCode: varchar("postal_code", { length: 20 }),
    background: text("background"),
    presentation: jsonb("presentation"),
    ratings: jsonb("ratings"),
    reviews: jsonb("reviews"),
    urlPath: varchar("url_path", { length: 200 }).notNull().unique(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => ({
    maklareEmbeddingIndex: index("maklare_embedding_index").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops"),
    ),
  }),
);
