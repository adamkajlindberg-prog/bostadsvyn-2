import {
    date,
    integer,
    pgTable,
    serial,
    timestamp,
    real,
    boolean,
    varchar,
} from "drizzle-orm/pg-core";

export const riksbankSwestrInterestRate = pgTable(
    "riksbank_swestr_interest_rate",
    {
        id: serial("id").primaryKey(),
        rate: real("rate").notNull(),
        date: date("date").notNull(),
        pctl125: real("pctl12_5").notNull(),
        pctl875: real("pctl87_5").notNull(),
        volume: integer("volume").notNull(),
        alternativeCalculation: boolean("alternative_calculation").notNull().default(false),
        alternativeCalculationReason: varchar("alternative_calculation_reason", { length: 255 }),
        publicationTime: timestamp("publication_time").notNull(),
        republication: boolean("republication").notNull().default(false),
        numberOfTransactions: integer("number_of_transactions").notNull(),
        numberOfAgents: integer("number_of_agents").notNull(),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().defaultNow(),
        deletedAt: timestamp("deleted_at"),
    }
);