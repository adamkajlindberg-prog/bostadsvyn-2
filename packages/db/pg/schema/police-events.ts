import {
    doublePrecision,
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

export const policeEvents = pgTable(
    "police_events",
    {
        id: serial("id").primaryKey(),
        embedding: vector("embedding", { dimensions: env.EMBEDDING_DIMENSIONALITY }).notNull(),
        policeEventId: integer("police_event_id").unique().notNull(),
        datetime: varchar("datetime", { length: 50 }).notNull(),
        name: varchar("name", { length: 255 }).notNull(),
        summary: text("summary"),
        url: varchar("url", { length: 255 }).notNull(),
        type: varchar("type", { length: 50 }).notNull(),
        locationName: varchar("location_name", { length: 100 }).notNull(),
        locationGpsLat: doublePrecision("location_gps_lat").notNull(),
        locationGpsLng: doublePrecision("location_gps_lng").notNull(),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().defaultNow(),
        deletedAt: timestamp("deleted_at"),
    },
    (table) => ({
        policeEmbeddingIndex: index("police_embedding_index").using(
            "hnsw",
            table.embedding.op("vector_cosine_ops"),
        ),
    }),
);
