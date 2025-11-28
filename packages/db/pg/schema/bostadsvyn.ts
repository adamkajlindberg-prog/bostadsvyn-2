import {
    index,
    pgTable,
    serial,
    text,
    timestamp,
    vector,
} from "drizzle-orm/pg-core";
import { env } from "../../env";

export const bostadsvyn = pgTable(
    "bostadsvyn",
    {
        id: serial("id").primaryKey(),
        embedding: vector("embedding", { dimensions: env.EMBEDDING_DIMENSIONALITY }).notNull(),
        content: text("content").notNull(),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().defaultNow(),
        deletedAt: timestamp("deleted_at"),
    },
    (table) => ({
        bostadsvynEmbeddingIndex: index("bostadsvyn_embedding_index").using(
            "hnsw",
            table.embedding.op("vector_cosine_ops"),
        ),
    }),
);
