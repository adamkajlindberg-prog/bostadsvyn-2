import { type StripePlan, stripe } from "@better-auth/stripe";
import { type BetterAuthOptions, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { admin, magicLink } from "better-auth/plugins";
import { getDbClient } from "db";
import Stripe from "stripe";
import { sendEmail } from "@/email";
import { env } from "@/env";
import { prices } from "@/payments/pricing-plans";
import { cacheAdapter } from "./cache-adapter";
import { ac, roles } from "./permissions";

const authConfig = {
  basePath: "/api/auth",
  // No cache adapter here to avoid ioredis in client bundle
  baseURL: env.NEXT_PUBLIC_WEB_URL,
  database: drizzleAdapter(getDbClient(), {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        from: env.AUTH_FROM_EMAIL,
        subject: "Verify your email address",
        html: `<a href="${url}">Click here to verify your email</a>`,
      });
    },
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        sendEmail({
          from: env.AUTH_FROM_EMAIL,
          html: `<a href="${url}">Click here to sign in</a>`,
          subject: "Sign in to Bostadsvyn",
          to: email,
        });
      },
    }),
    admin({
      ac,
      adminRoles: ["admin"],
      defaultRole: "free",
      roles,
    }),
    stripe({
      createCustomerOnSignUp: true,
      stripeClient: new Stripe(env.STRIPE_SECRET_KEY),
      stripeWebhookSecret: env.STRIPE_WEBHOOK_SECRET,
      subscription: {
        enabled: true,
        plans: async () => {
          const plans: StripePlan[] = [];
          for (const p of Object.values(prices)) {
            plans.push({
              lookupKey: p.id,
              name: p.id,
            });
          }
          return plans;
        },
      },
    }),
    nextCookies(), // https://www.better-auth.com/docs/integrations/next#server-action-cookies
  ],
  rateLimit: {
    enabled: true,
    max: 100,
    storage: "secondary-storage", // time window in seconds
    window: 60, // max requests in the window
  },
  secondaryStorage: cacheAdapter,
  secret: env.AUTH_SECRET,
  session: {
    cookieCache: {
      enabled: false,
    },
  },
  trustedOrigins: [env.NEXT_PUBLIC_WEB_URL],
} satisfies BetterAuthOptions;

export const auth = betterAuth(authConfig) as ReturnType<
  typeof betterAuth<typeof authConfig>
>;

export type Auth = typeof auth;

export type Session = typeof auth.$Infer.Session;

export type User = Session["user"];
