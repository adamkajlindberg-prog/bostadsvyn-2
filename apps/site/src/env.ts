import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const boolean = z.string().transform((s) => s === "true");

export const env = createEnv({
  client: {
    NEXT_PUBLIC_CUSTOMER_SERVICE_EMAIL: z.email(),
    NEXT_PUBLIC_POSTHOG_HOST: z.string().optional(),
    NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
    NEXT_PUBLIC_WEB_URL: z.url(),
  },
  emptyStringAsUndefined: true,
  experimental__runtimeEnv: {
    NEXT_PUBLIC_CUSTOMER_SERVICE_EMAIL:
      process.env.NEXT_PUBLIC_CUSTOMER_SERVICE_EMAIL,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_WEB_URL: process.env.NEXT_PUBLIC_WEB_URL,
  },
  server: {
    // Auth
    AUTH_FROM_EMAIL: z
      .email()
      .describe(
        "Email address to send emails from. Needs to be verified in SendGrid",
      ),
    AUTH_SECRET: z
      .string()
      .describe(
        "You can generate the secret via 'openssl rand -base64 32' on Unix",
      ),
    DISABLE_INDEXING: boolean.optional().default(false),
    REDIS_PREFIX: z.string().min(1),
    REDIS_TOKEN: z.string().min(1).describe("Redis token for Upstash"),

    // Cache
    REDIS_URL: z
      .url()
      .describe("Create a new Redis instance at https://upstash.com/"),

    // Stripe
    STRIPE_SECRET_KEY: z.string().min(1),
    STRIPE_SKIP_WEBHOOK_SIGNATURE_CHECK: boolean.optional(),
    STRIPE_WEBHOOK_SECRET: z.string().min(1),

    // Resend
    RESEND_API_KEY: z.string().min(1),

    // AI
    GEMINI_API_KEY: z.string().default(""),
    OPENAI_API_KEY: z.string().default(""),
    EMBEDDING_DIMENSIONALITY: z
      .string()
      .default("1536")
      .transform((s) => parseInt(s, 10)),
    AI_CHAT_AGENT: z.string().default("OPENAI"),

    // Trafikverket
    TRAFIKVERKET_API_KEY: z.string().default(""),

    R2_ACCESS_KEY_ID: z
      .string()
      .min(1)
      .describe("Create from Cloudfare dashboard https://dash.cloudflare.com"),
    R2_ACCESS_SECRET: z.string().min(1),
    R2_BUCKET: z
      .string()
      .min(1)
      .describe("The bucket name you created in the R2 dashboard"),
    R2_ENDPOINT: z
      .url()
      .describe(
        "https://[account_id].r2.cloudflarestorage.com for dev. Always conntect a custom domain for production",
      ),
    R2_REGION: z
      .string()
      .min(1)
      .optional()
      .describe("The region where the bucket is located"),

    // IDURA
    IDURA_CLIENT_ID: z.string().min(1),
    IDURA_CLIENT_SECRET: z.string().min(1),
    IDURA_CLIENT_URL: z.url(),
  },
});
