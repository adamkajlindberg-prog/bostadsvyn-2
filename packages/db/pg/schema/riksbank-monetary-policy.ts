import {
    date,
    index,
    pgTable,
    serial,
    text,
    timestamp,
    varchar,
    vector,
} from "drizzle-orm/pg-core"; 
import { env } from "../../env";

export const riksbankMonetaryPolicy = pgTable(
    "riksbank_monetary_policy",
    {
        id: serial("id").primaryKey(),
        embedding: vector("embedding", { dimensions: env.EMBEDDING_DIMENSIONALITY }).notNull(),
        externalId: varchar("external_id", { length: 20 }).unique().notNull(),
        description: varchar("description", { length: 255 }).notNull(),
        sourceAgency: varchar("source_agency", { length: 100 }).notNull(),
        unit: varchar("unit", { length: 50 }).notNull(),
        note: text("note"),
        startDate: date("start_date").notNull(),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().defaultNow(),
        deletedAt: timestamp("deleted_at"),
    },
    (table) => ({
        monetaryEmbeddingIndex: index("monetary_embedding_index").using(
            "hnsw",
            table.embedding.op("vector_cosine_ops"),
        ),
    }),
);
