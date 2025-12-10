import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { organization } from "./organization";
import { user } from "./user";

export const brokers = pgTable("brokers", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" })
    .unique(),
  organizationId: text("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),
  brokerName: text("broker_name").notNull(),
  brokerEmail: text("broker_email").notNull(),
  brokerPhone: text("broker_phone"),
  licenseNumber: text("license_number"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Broker = typeof brokers.$inferSelect;
export type NewBroker = typeof brokers.$inferInsert;

// export const brokerOffices = pgTable("broker_offices", {
//   id: uuid("id").defaultRandom().primaryKey(),
//   brokerId: uuid("broker_id")
//     .notNull()
//     .references(() => brokers.id, { onDelete: "cascade" }),
//   officeName: text("office_name").notNull(),
//   officeAddress: text("office_address"),
//   officeCity: text("office_city"),
//   officePhone: text("office_phone"),
//   officeEmail: text("office_email"),
//   officeWebsite: text("office_website"),
//   createdAt: timestamp("created_at", { withTimezone: true })
//     .notNull()
//     .defaultNow(),
//   updatedAt: timestamp("updated_at", { withTimezone: true })
//     .notNull()
//     .defaultNow(),
// });

// export type BrokerOffice = typeof brokerOffices.$inferSelect;
// export type NewBrokerOffice = typeof brokerOffices.$inferInsert;

export type BrokerOffice = typeof brokers.$inferSelect;
export type NewBrokerOffice = typeof brokers.$inferInsert;
