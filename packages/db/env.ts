import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  emptyStringAsUndefined: true,
  experimental__runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    EMBEDDING_DIMENSIONALITY: process.env.EMBEDDING_DIMENSIONALITY,
    AI_CHAT_AGENT: process.env.AI_CHAT_AGENT,
  },
  server: {
    DATABASE_URL: z
      .string()
      .min(1)
      .describe("PostgreSQL database connection URL"),
    EMBEDDING_DIMENSIONALITY: z
      .string()
      .default("1536")
      .transform((s) => parseInt(s, 10)),
    AI_CHAT_AGENT: z.string().default("OPENAI"),
    TRAFIKVERKET_API_KEY: z.string().default(""),
  },
});
