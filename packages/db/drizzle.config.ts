import type { Config } from "drizzle-kit";
import { DATABASE_URL } from "./env";

export default {
	dbCredentials: {
		url: DATABASE_URL!,
	},
	dialect: "postgresql",
	out: "pg/.drizzle",
	schema: "pg/schema/*",
} satisfies Config;
