import {
    date,
    integer,
    pgTable,
    serial,
    timestamp,
    jsonb,
    varchar,
} from "drizzle-orm/pg-core";
import { riksbankMonetaryPolicy } from "./riksbank-monetary-policy";

export const riksbankVintages = pgTable(
    "riksbank_vintages",
    {
        id: serial("id").primaryKey(),
        monetaryPolicyId: integer("monetary_policy_id")
            .notNull()
            .references(() => riksbankMonetaryPolicy.id, { onDelete: "cascade" }),
        forecastCutoffDate: date("forecast_cutoff_date").notNull(),
        policyRound: varchar("policy_round", { length: 20 }).notNull(),
        policyRoundEndDtm: date("policy_round_end_dtm").notNull(),
        observations: jsonb("observations").notNull(),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().defaultNow(),
        deletedAt: timestamp("deleted_at"),
    }
);