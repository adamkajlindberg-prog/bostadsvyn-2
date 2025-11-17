import type { Config } from "drizzle-kit";
import { DATABASE_URL } from "./env";

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

export default {
  dbCredentials: {
    url: DATABASE_URL,
  },
  dialect: "postgresql",
  out: "pg/.drizzle",
  schema: "pg/schema/*",
} satisfies Config;
