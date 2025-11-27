import {
    date,
    pgTable,
    serial,
    timestamp,
    real,
    boolean,
} from "drizzle-orm/pg-core";

export const riksbankSwestrPublishedIndex = pgTable(
    "riksbank_swestr_published_index",
    {
        id: serial("id").primaryKey(),
        value: real("value").notNull(),
        date: date("date").notNull(),
        publicationTime: timestamp("publication_time").notNull(),
        republication: boolean("republication").notNull().default(false),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().defaultNow(),
        deletedAt: timestamp("deleted_at"),
    }
);