import { stripeClient } from "@better-auth/stripe/client";
import { adminClient, magicLinkClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { env } from "@/env";
import { ac, roles } from "./permissions";

export const authClient = createAuthClient({
  basePath: "/api/auth",
  baseURL: env.NEXT_PUBLIC_WEB_URL,
  plugins: [
    magicLinkClient(),
    adminClient({
      ac,
      roles,
    }),
    stripeClient({
      subscription: true,
    }),
  ],
});
