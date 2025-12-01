import {
    integer,
    pgTable,
    serial,
    timestamp,
    text,
    jsonb,
} from "drizzle-orm/pg-core";
import { lantmaterietCategory } from "./lantmateriet-category";

export const lantmateriet = pgTable(
    "lantmateriet",
    {
        id: serial("id").primaryKey(),
        categoryId: integer("category_id")
            .notNull()
            .references(() => lantmaterietCategory.id, { onDelete: "cascade" }),
        entryId: integer("entry_id").notNull(),
        title: text("title").notNull(),
        summary: text("summary").notNull(),
        geoPolygon: jsonb("geo_polygon").notNull(),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().defaultNow(),
        deletedAt: timestamp("deleted_at"),
    }
);