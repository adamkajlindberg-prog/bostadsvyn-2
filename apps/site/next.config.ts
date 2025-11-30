import type { NextConfig } from "next";

// Import to validate env variables on build
import "./src/env";
import { env } from "./src/env";

// Extract bucket URL for image configuration
const bucketUrl = new URL(env.NEXT_PUBLIC_BUCKET_URL);

const nextConfig: NextConfig = {
  distDir: "dist",
  images: {
    remotePatterns: [
      {
        protocol: bucketUrl.protocol.slice(0, -1) as "http" | "https",
        hostname: bucketUrl.hostname,
      },
    ],
  },
  async rewrites() {
    return env.NEXT_PUBLIC_POSTHOG_HOST
      ? [
          {
            destination: `${env.NEXT_PUBLIC_POSTHOG_HOST}/static/:path*`,
            source: "/api/teddy/static/:path*",
          },
          {
            destination: `${env.NEXT_PUBLIC_POSTHOG_HOST}/:path*`,
            source: "/api/teddy/:path*",
          },
        ]
      : [];
  },
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
