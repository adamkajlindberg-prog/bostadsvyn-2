import type { Config } from "drizzle-kit";

export default {
	dbCredentials: {
		url: process.env.DATABASE_URL!,
	},
	dialect: "postgresql",
	out: "pg/.drizzle",
	schema: "pg/schema/*",
} satisfies Config;
