import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";
import { user } from "./user";

export const groups = pgTable("groups", {
  id: varchar("id", { length: 255 }).primaryKey(),
  name: text("name").notNull(),
  inviteCode: varchar("invite_code", { length: 20 }).notNull().unique(),
  createdBy: varchar("created_by", { length: 255 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Group = typeof groups.$inferSelect;
export type NewGroup = typeof groups.$inferInsert;

