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

export const scb = pgTable(
    "scb",
    {
        id: serial("id").primaryKey(),
        embedding: vector("embedding", { dimensions: env.EMBEDDING_DIMENSIONALITY }).notNull(),
        scbId: varchar("scb_id", { length: 20 }).unique().notNull(),
        label: text("label").notNull(),
        firstPeriod: varchar("first_period", { length: 20 }).notNull(),
        lastPeriod: varchar("last_period", { length: 20 }).notNull(),
        data: text("data").notNull(),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().defaultNow(),
        deletedAt: timestamp("deleted_at"),
    },
    (table) => ({
        scbEmbeddingIndex: index("scb_embedding_index").using(
            "hnsw",
            table.embedding.op("vector_cosine_ops"),
        ),
    }),
);
