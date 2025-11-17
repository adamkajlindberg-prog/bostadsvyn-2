import type { z } from "zod/v4";

export interface CacheConfig {
  url: string;
  prefix: string;
  token?: string; // Optional for Upstash
}

export interface CacheClient {
  prefix: string;

  // Key management
  key(key: string): string;

  // Basic operations
  getRaw(key: string): Promise<string | null>;
  set(key: string, value: string, ttlSeconds?: number): Promise<void>;
  setExAt(key: string, value: string, exat: number): Promise<void>;
  del(key: string): Promise<void>;
  getDelRaw(key: string): Promise<string | null>;
  exists(key: string): Promise<boolean>;
  ttl(key: string): Promise<number>;
  expire(key: string, seconds: number): Promise<void>;

  // Pipeline operations
  pipelineGetTtl(key: string): Promise<[string | null, number]>;

  // Sorted set operations
  zadd(key: string, score: number, member: string): Promise<void>;
  zrem(key: string, member: string): Promise<void>;
  zrangeWithScores(
    key: string,
    start: number,
    stop: number,
  ): Promise<(string | number)[]>;
  zrangeByScore(key: string, min: number, max: number): Promise<string[]>;
  zcard(key: string): Promise<number>;
  zincrby(key: string, increment: number, member: string): Promise<void>;
  zscore(key: string, member: string): Promise<number | null>;
  zremrangebyscore(key: string, min: number, max: number): Promise<void>;

  // Typed operations with schema validation
  get<T extends z.ZodType>(key: string, schema: T): Promise<z.infer<T> | null>;
  getDel<T extends z.ZodType>(
    key: string,
    schema: T,
  ): Promise<z.infer<T> | null>;
  setTyped<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
}
