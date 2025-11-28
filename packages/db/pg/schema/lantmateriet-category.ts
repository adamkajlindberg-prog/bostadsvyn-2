import {
    index,
    pgTable,
    serial,
    text,
    timestamp,
    varchar,
    vector,
} from "drizzle-orm/pg-core"; 
import { env } from "../../env";

export const lantmaterietCategory = pgTable(
    "lantmateriet_category",
    {
        id: serial("id").primaryKey(),
        embedding: vector("embedding", { dimensions: env.EMBEDDING_DIMENSIONALITY }).notNull(),
        title: varchar("title", { length: 255 }).notNull(),
        subtitle: text("subtitle").notNull(),
        authorName: varchar("author_name", { length: 100 }),
        authorEmail: varchar("author_email", { length: 255 }),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().defaultNow(),
        deletedAt: timestamp("deleted_at"),
    },
    (table) => ({
        lantmaterietEmbeddingIndex: index("lantmateriet_embedding_index").using(
            "hnsw",
            table.embedding.op("vector_cosine_ops"),
        ),
    }),
);
