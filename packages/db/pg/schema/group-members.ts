import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
import { groups } from "./groups";
import { user } from "./user";

export const groupMembers = pgTable("group_members", {
  id: varchar("id", { length: 255 }).primaryKey(),
  groupId: varchar("group_id", { length: 255 })
    .notNull()
    .references(() => groups.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 20 }).notNull().default("member"),
  joinedAt: timestamp("joined_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type GroupMember = typeof groupMembers.$inferSelect;
export type NewGroupMember = typeof groupMembers.$inferInsert;

