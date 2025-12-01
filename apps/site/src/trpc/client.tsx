"use client";

import type { QueryClient } from "@tanstack/react-query";
import {
  type CreateTRPCClientOptions,
  createTRPCClient,
  httpBatchStreamLink,
  loggerLink,
} from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import SuperJSON from "superjson";
import { env } from "@/env";
import type { AppRouter } from "@/trpc/routes/index";
import { createQueryClient } from "./query-client";

let clientQueryClientSingleton: QueryClient | undefined;
export const getQueryClient = () => {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return createQueryClient();
  }
  // Browser: use singleton pattern to keep the same query client
  if (!clientQueryClientSingleton) {
    clientQueryClientSingleton = createQueryClient();
  }
  return clientQueryClientSingleton;
};

export const trpcOptions: CreateTRPCClientOptions<AppRouter> = {
  links: [
    loggerLink({
      enabled: () => true, // Enable all logging for debugging
    }),
    httpBatchStreamLink({
      headers() {
        const headers = new Headers();
        headers.set("x-trpc-source", "nextjs-react");
        return headers;
      },
      transformer: SuperJSON,
      url: `${env.NEXT_PUBLIC_WEB_URL}/api/trpc`,
    }),
  ],
};

/**
 * Vanilla TRPC Client, can onky be used where there is no SSR
 */
export const trpc = createTRPCClient<AppRouter>(trpcOptions);

export const { useTRPC, TRPCProvider } = createTRPCContext<AppRouter>();
