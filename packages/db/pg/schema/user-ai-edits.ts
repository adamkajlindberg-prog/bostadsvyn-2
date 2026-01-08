import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { properties } from "./property";
import { user } from "./user";

export const userAiEdits = pgTable(
  "user_ai_edits",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    propertyId: uuid("property_id").references(() => properties.id, {
      onDelete: "set null",
    }),
    propertyTitle: text("property_title"),
    originalImageUrl: text("original_image_url").notNull(),
    editedImageUrl: text("edited_image_url").notNull(),
    editPrompt: text("edit_prompt").notNull(),
    editType: text("edit_type").notNull().default("renovation"),
    isFavorite: boolean("is_favorite").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    index("idx_user_ai_edits_user_id").on(table.userId),
    index("idx_user_ai_edits_property_id").on(table.propertyId),
    index("idx_user_ai_edits_created_at").on(table.createdAt),
    index("idx_user_ai_edits_is_favorite").on(table.userId, table.isFavorite),
  ],
);

export type UserAiEdit = typeof userAiEdits.$inferSelect;
export type NewUserAiEdit = typeof userAiEdits.$inferInsert;

