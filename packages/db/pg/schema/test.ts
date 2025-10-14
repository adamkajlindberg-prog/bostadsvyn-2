import { pgTable, serial, text } from "drizzle-orm/pg-core";

// This schema is just for testing purposes and can be removed later
export const test = pgTable("test", {
    id: serial("id").primaryKey(),
    value: text("value").notNull(),
})