import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { properties } from "./property";
import { user } from "./user";

export const conversations = pgTable("conversations", {
  id: uuid("id").defaultRandom().primaryKey(),
  propertyId: uuid("property_id")
    .notNull()
    .references(() => properties.id, { onDelete: "cascade" }),
  buyerId: varchar("buyer_id", { length: 255 }).notNull(),
  sellerId: varchar("seller_id", { length: 255 }).notNull(),
  subject: text("subject"),
  status: text("status").notNull().default("active"),
  lastMessageAt: timestamp("last_message_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;

export const messages = pgTable("messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  conversationId: uuid("conversation_id")
    .notNull()
    .references(() => conversations.id, { onDelete: "cascade" }),
  senderId: varchar("sender_id", { length: 255 }).notNull(),
  content: text("content").notNull(),
  messageType: text("message_type").notNull().default("text"),
  readAt: timestamp("read_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;

export const viewingRequests = pgTable("viewing_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  propertyId: uuid("property_id")
    .notNull()
    .references(() => properties.id, { onDelete: "cascade" }),
  requesterId: varchar("requester_id", { length: 255 }).notNull(),
  requestedDate: timestamp("requested_date", { withTimezone: true }).notNull(),
  alternativeDate1: timestamp("alternative_date_1", { withTimezone: true }),
  alternativeDate2: timestamp("alternative_date_2", { withTimezone: true }),
  status: text("status").notNull().default("pending"),
  contactPhone: text("contact_phone"),
  contactEmail: text("contact_email").notNull(),
  message: text("message"),
  responseMessage: text("response_message"),
  confirmedDate: timestamp("confirmed_date", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type ViewingRequest = typeof viewingRequests.$inferSelect;
export type NewViewingRequest = typeof viewingRequests.$inferInsert;

export const propertyInquiries = pgTable("property_inquiries", {
  id: uuid("id").defaultRandom().primaryKey(),
  propertyId: uuid("property_id")
    .notNull()
    .references(() => properties.id, { onDelete: "cascade" }),
  inquirerId: varchar("inquirer_id", { length: 255 }).references(
    () => user.id,
    { onDelete: "set null" },
  ),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message").notNull(),
  inquiryType: text("inquiry_type").notNull().default("general"),
  status: text("status").notNull().default("new"),
  response: text("response"),
  respondedAt: timestamp("responded_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type PropertyInquiry = typeof propertyInquiries.$inferSelect;
export type NewPropertyInquiry = typeof propertyInquiries.$inferInsert;
