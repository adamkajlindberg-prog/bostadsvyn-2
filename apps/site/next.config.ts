import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    WEB_URL: process.env.WEB_URL
  }
};

export default nextConfig;
