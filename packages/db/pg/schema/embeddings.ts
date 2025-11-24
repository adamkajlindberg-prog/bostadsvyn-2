import {
  index,
  integer,
  pgTable,
  serial,
  text,
  vector,
} from "drizzle-orm/pg-core";
import { env } from "../../env";
import { resources } from "./resources";

export const embeddings = pgTable(
  "embedding",
  {
    content: text("content").notNull(),
    embedding: vector("embedding", {
      dimensions: env.EMBEDDING_DIMENSIONALITY,
    }).notNull(),
    id: serial("id").primaryKey(),
    resourceId: integer("resource_id").references(() => resources.id, {
      onDelete: "cascade",
    }),
  },
  (table) => ({
    embeddingIndex: index("embeddingIndex").using(
      "hnsw",
      table.embedding.op("vector_cosine_ops"),
    ),
  }),
);
