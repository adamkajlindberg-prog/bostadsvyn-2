import {
    date,
    integer,
    pgTable,
    serial,
    timestamp,
    real,
} from "drizzle-orm/pg-core";
import { riksbankSwea } from "./riksbank-swea";

export const riksbankSweaObservations = pgTable(
    "riksbank_swea_observations",
    {
        id: serial("id").primaryKey(),
        sweaId: integer("swea_id")
            .notNull()
            .references(() => riksbankSwea.id, { onDelete: "cascade" }),
        date: date("date").notNull(),
        value: real("value").notNull(),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().defaultNow(),
        deletedAt: timestamp("deleted_at"),
    }
);