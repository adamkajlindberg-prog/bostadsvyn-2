import type { Config } from "drizzle-kit";
import { env } from "./env";

export default {
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  dialect: "postgresql",
  out: "pg/.drizzle",
  schema: "pg/schema/*",
} satisfies Config;
