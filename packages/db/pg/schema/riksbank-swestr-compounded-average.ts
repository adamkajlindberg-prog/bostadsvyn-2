import {
    date,
    pgTable,
    serial,
    timestamp,
    real,
    boolean,
} from "drizzle-orm/pg-core";

export const riksbankSwestrCompoundedAverage = pgTable(
    "riksbank_swestr_compounded_average",
    {
        id: serial("id").primaryKey(),
        rate: real("rate").notNull(),
        date: date("date").notNull(),
        startDate: date("start_date").notNull(),
        publicationTime: timestamp("publication_time").notNull(),
        republication: boolean("republication").notNull().default(false),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().defaultNow(),
        deletedAt: timestamp("deleted_at"),
    }
);