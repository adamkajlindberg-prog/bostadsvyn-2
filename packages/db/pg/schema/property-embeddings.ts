import {
  index,
  pgTable,
  serial,
  timestamp,
  uuid,
  vector,
} from "drizzle-orm/pg-core";
import { env } from "../../env";
import { properties } from "./property";

export const propertyEmbeddings = pgTable(
  "property_embeddings",
  {
    id: serial("id").primaryKey(),
    embedding: vector("embedding", {
      dimensions: env.EMBEDDING_DIMENSIONALITY,
    }).notNull(),
    propertyId: uuid("property_id")
      .notNull()
      .references(() => properties.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => ({
    propertyEmbeddingIndex: index("property_embedding_index").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops"),
    ),
  }),
);
