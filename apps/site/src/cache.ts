import type { CacheClient } from "@bostadsvyn/cache";
import { UpstashCacheClient } from "@bostadsvyn/cache/upstash";
import { Redis } from "@upstash/redis";
import { env } from "./env";

let _client: CacheClient | null = null;
let _redis: Redis | null = null;

export const getCache = () => {
  if (!_client) {
    _client = new UpstashCacheClient({
      prefix: env.REDIS_PREFIX,
      token: env.REDIS_TOKEN,
      url: env.REDIS_URL,
    });
  }
  return _client;
};

export const getRedis = () => {
  if (!_redis) {
    _redis = new Redis({
      token: env.REDIS_TOKEN,
      url: env.REDIS_URL,
    });
  }
  return _redis;
};
