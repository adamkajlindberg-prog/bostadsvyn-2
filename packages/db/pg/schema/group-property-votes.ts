import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { groups } from "./groups";
import { properties } from "./property";
import { user } from "./user";

export const groupPropertyVotes = pgTable("group_property_votes", {
  id: varchar("id", { length: 255 }).primaryKey(),
  groupId: varchar("group_id", { length: 255 })
    .notNull()
    .references(() => groups.id, { onDelete: "cascade" }),
  propertyId: uuid("property_id")
    .notNull()
    .references(() => properties.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  vote: varchar("vote", { length: 10 }).notNull(), // 'yes', 'no', 'maybe'
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type GroupPropertyVote = typeof groupPropertyVotes.$inferSelect;
export type NewGroupPropertyVote = typeof groupPropertyVotes.$inferInsert;

