import {
    boolean,
    date,
    index,
    integer,
    pgTable,
    serial,
    text,
    timestamp,
    varchar,
    vector,
} from "drizzle-orm/pg-core"; 
import { env } from "../../env";

export const riksbankSwea = pgTable(
    "riksbank_swea",
    {
        id: serial("id").primaryKey(),
        embedding: vector("embedding", { dimensions: env.EMBEDDING_DIMENSIONALITY }).notNull(),
        seriesId: varchar("series_id", { length: 20 }).unique().notNull(),
        source: varchar("source", { length: 255 }).notNull(),
        shortDescription: varchar("short_description", { length: 255 }).notNull(),
        midDescription: text("mid_description").notNull(),
        longDescription: text("long_description").notNull(),
        groupId: integer("group_id").notNull(),
        observationMaxDate: date("observation_max_date").notNull(),
        observationMinDate: date("observation_min_date").notNull(),
        seriesClosed: boolean("series_closed").notNull().default(false),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().defaultNow(),
        deletedAt: timestamp("deleted_at"),
    },
    (table) => ({
        sweaEmbeddingIndex: index("swea_embedding_index").using(
            "hnsw",
            table.embedding.op("vector_cosine_ops"),
        ),
    }),
);
