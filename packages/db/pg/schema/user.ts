import {
  boolean,
  pgTable,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  banExpires: timestamp(),
  banned: boolean().notNull().default(false),
  banReason: text(),
  createdAt: timestamp().notNull().defaultNow(),
  email: text().notNull().unique(),
  emailVerified: boolean().notNull().default(false),
  id: varchar({ length: 255 }).notNull().primaryKey(),
  image: text(),
  name: text(),

  // Admin See roles in permissions.ts
  role: varchar({ length: 255 }).notNull().default("buyer"),

  // Payments
  stripeCustomerId: varchar({ length: 255 }).unique(),
  updatedAt: timestamp().notNull().defaultNow(),
});

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;

export const account = pgTable(
  "account",
  {
    accessToken: text(),
    accessTokenExpiresAt: timestamp(),
    accountId: varchar({ length: 255 }).notNull(),
    createdAt: timestamp().notNull().defaultNow(),
    id: varchar({ length: 255 }).primaryKey(),
    idToken: text(),
    providerId: varchar({ length: 255 }).notNull(),
    refreshToken: text(),
    refreshTokenExpiresAt: timestamp(),
    scope: text(),
    updatedAt: timestamp().notNull().defaultNow(),
    userId: varchar({ length: 255 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (tbl) => [unique().on(tbl.providerId, tbl.accountId)],
);

export type DbAccount = typeof account.$inferSelect;
export type DbNewAccount = typeof account.$inferInsert;

export const verification = pgTable("verification", {
  createdAt: timestamp().notNull().defaultNow(),
  expiresAt: timestamp().notNull(),
  id: varchar({ length: 255 }).primaryKey(),
  identifier: text().notNull(),
  updatedAt: timestamp().notNull().defaultNow(),
  value: text().notNull(),
});

export type DbVerificationToken = typeof verification.$inferSelect;
export type DbNewVerificationToken = typeof verification.$inferInsert;

export const session = pgTable("session", {
  createdAt: timestamp().notNull().defaultNow(),
  expiresAt: timestamp().notNull(),
  id: varchar({ length: 255 }).primaryKey(),
  impersonatedById: varchar({ length: 255 }).references(() => user.id),
  ipAddress: varchar({ length: 255 }),
  token: text().notNull(),
  updatedAt: timestamp().notNull().defaultNow(),
  userAgent: text(),
  userId: varchar({ length: 255 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export type DbSession = typeof session.$inferSelect;
export type DbNewSession = typeof session.$inferInsert;
