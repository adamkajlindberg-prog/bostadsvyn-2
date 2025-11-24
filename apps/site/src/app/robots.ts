import type { MetadataRoute } from "next";
import { env } from "../env";

export default function robots(): MetadataRoute.Robots {
  if (env.DISABLE_INDEXING) {
    return {
      rules: {
        disallow: "/",
        userAgent: "*",
      },
    };
  }
  return {
    rules: {
      allow: "/",
      userAgent: "*",
    },
  };
}
