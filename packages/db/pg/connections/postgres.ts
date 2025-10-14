import { drizzle } from "drizzle-orm/node-postgres";

let _client: DbClient | undefined;

import * as schema from "../schema";

export const getDbClient = () => {
	if (!_client) {
		_client = createDbClient();
	}
	return _client;
};

const createDbClient = () => {
	const url = process.env.DATABASE_URL!;
	return drizzle({
		connection: {
			connectionString: url,
			ssl:
				process.env.NODE_ENV === "production" &&
				!url.includes("localhost") &&
				!url.includes("9090")
					? 
                    {
						rejectUnauthorized: false, // allow self-signed certs
					}
					: false,
		},
		schema,
	});
};

export type DbClient = ReturnType<typeof createDbClient>;

export * from "../schema";
