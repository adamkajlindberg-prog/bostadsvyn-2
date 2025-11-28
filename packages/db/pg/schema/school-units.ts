import {
    boolean,
    date,
    index,
    pgTable,
    serial,
    timestamp,
    varchar,
    vector,
} from "drizzle-orm/pg-core";
import { env } from "../../env";

export const schoolUnits = pgTable(
    "school_units",
    {
        id: serial("id").primaryKey(),
        embedding: vector("embedding", { dimensions: env.EMBEDDING_DIMENSIONALITY }).notNull(),
        schoolUnitCode: varchar("school_unit_code", { length: 20 }).unique().notNull(),
        schoolName: varchar("school_name", { length: 255 }),
        displayName: varchar("display_name", { length: 255 }).notNull(),
        status: varchar("status", { length: 50 }).notNull(),
        url: varchar("url", { length: 255 }),
        email: varchar("email", { length: 255 }),
        phoneNumber: varchar("phone_number", { length: 50 }),
        headMaster: varchar("head_master", { length: 100 }),
        streetAddress: varchar("street_address", { length: 255 }),
        locality: varchar("locality", { length: 100 }),
        postalCode: varchar("postal_code", { length: 20 }),
        orientationType: varchar("orientation_type", { length: 50 }),
        schoolUnitType: varchar("school_unit_type", { length: 50 }),
        municipalityCode: varchar("municipality_code", { length: 20 }),
        specialSupportSchool: boolean("special_support_school").notNull().default(false),
        hospitalSchool: boolean("hospital_school").notNull().default(false),
        startDate: date("start_date"),
        endDate: date("end_date"),
        createdAt: timestamp("created_at").notNull().defaultNow(),
        updatedAt: timestamp("updated_at").notNull().defaultNow(),
        deletedAt: timestamp("deleted_at"),
    },
    (table) => ({
        schoolEmbeddingIndex: index("school_embedding_index").using(
            "hnsw",
            table.embedding.op("vector_cosine_ops"),
        ),
    }),
);
