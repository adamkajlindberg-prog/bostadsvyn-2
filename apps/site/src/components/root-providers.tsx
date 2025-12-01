"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient } from "@trpc/client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { getQueryClient, TRPCProvider, trpcOptions } from "@/trpc/client";
import type { AppRouter } from "@/trpc/routes";

const Devtools =
  process.env.NODE_ENV === "development"
    ? dynamic(() => import("./devtools"), { ssr: false })
    : () => null;

export function RootProviders(props: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  // SSR safe TRPC Client
  // Get it from useTRPC
  const [trpcClient] = useState(() => createTRPCClient<AppRouter>(trpcOptions));

  return (
    <QueryClientProvider client={queryClient}>
      <Devtools />
      <TRPCProvider queryClient={queryClient} trpcClient={trpcClient}>
        {props.children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}
