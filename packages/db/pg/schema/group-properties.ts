import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { groups } from "./groups";
import { properties } from "./property";
import { user } from "./user";

export const groupProperties = pgTable("group_properties", {
  id: varchar("id", { length: 255 }).primaryKey(),
  groupId: varchar("group_id", { length: 255 })
    .notNull()
    .references(() => groups.id, { onDelete: "cascade" }),
  propertyId: uuid("property_id")
    .notNull()
    .references(() => properties.id, { onDelete: "cascade" }),
  addedBy: varchar("added_by", { length: 255 })
    .notNull()
    .references(() => user.id, { onDelete: "set null" }),
  status: varchar("status", { length: 20 })
    .notNull()
    .default("voting"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type GroupProperty = typeof groupProperties.$inferSelect;
export type NewGroupProperty = typeof groupProperties.$inferInsert;

