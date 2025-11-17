import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod/v4";

const env = createEnv({
  emptyStringAsUndefined: true,
  experimental__runtimeEnv: {
    DEBUG: process.env.DEBUG,
    REDIS_PREFIX: process.env.REDIS_PREFIX,
    REDIS_TOKEN: process.env.REDIS_TOKEN,
    REDIS_URL: process.env.REDIS_URL,
  },
  server: {
    DEBUG: z
      .string()
      .optional()
      .describe("Set to 'ioredis:*' to enable verbose logging in Redis"),
    REDIS_PREFIX: z
      .string()
      .min(1)
      .describe(
        "Always use a prefix to avoid conflicts with other services on the same Redis instance",
      ),
    REDIS_TOKEN: z
      .string()
      .optional()
      .describe("Redis token for Upstash (optional for ioredis)"),
    REDIS_URL: z
      .url()
      .describe("Create a new Redis instance at https://upstash.com/"),
  },
  skipValidation: process.env.npm_lifecycle_event === "lint",
});

export default env;
