import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import type { NextRequest } from "next/server";
import { createTRPCContext } from "@/trpc/init";
import { appRouter } from "@/trpc/routes";

/**
 * Configure basic CORS headers
 * You should extend this to match your needs
 */
const setCorsHeaders = (res: Response) => {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Request-Method", "*");
  res.headers.set("Access-Control-Allow-Methods", "OPTIONS, GET, POST");
  res.headers.set("Access-Control-Allow-Headers", "*");
};

export const OPTIONS = () => {
  const response = new Response(null, {
    status: 204,
  });
  setCorsHeaders(response);
  return response;
};

const handler = async (req: NextRequest) => {
  console.log("🔵 [tRPC Handler] Incoming request:", {
    headers: Object.fromEntries(req.headers.entries()),
    method: req.method,
    url: req.url,
  });

  const response = await fetchRequestHandler({
    createContext: () =>
      createTRPCContext({
        headers: req.headers,
      }),
    endpoint: "/api/trpc",
    onError({ error, path }) {
      console.error(`>>> tRPC Error on '${path}'`, error);
    },
    req,
    router: appRouter,
  });

  console.log("🔵 [tRPC Handler] Response status:", response.status);
  setCorsHeaders(response);
  return response;
};

export { handler as GET, handler as POST };
