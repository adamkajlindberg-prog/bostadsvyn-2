import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  emptyStringAsUndefined: true,
  experimental__runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
    R2_ACCESS_SECRET: process.env.R2_ACCESS_SECRET,
    R2_BUCKET: process.env.R2_BUCKET,
    R2_ENDPOINT: process.env.R2_ENDPOINT,
    R2_REGION: process.env.R2_REGION,
  },
  server: {
    DATABASE_URL: z
      .string()
      .min(1)
      .describe("PostgreSQL database connection URL"),
    GEMINI_API_KEY: z
      .string()
      .min(1)
      .describe("Google Gemini API key for image generation"),
    R2_ACCESS_KEY_ID: z.string().min(1).describe("Cloudflare R2 access key ID"),
    R2_ACCESS_SECRET: z.string().min(1).describe("Cloudflare R2 access secret"),
    R2_BUCKET: z.string().min(1).describe("Cloudflare R2 bucket name"),
    R2_ENDPOINT: z.url().describe("Cloudflare R2 endpoint URL"),
    R2_REGION: z.string().min(1).optional().describe("Cloudflare R2 region"),
  },
});
