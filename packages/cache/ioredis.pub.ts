import { logError } from "@bostadsvyn/common/error";
import { Redis } from "ioredis";
import type { z } from "zod/v4";
import type { CacheClient, CacheConfig } from "./index.pub.ts";

export class IoRedisCacheClient implements CacheClient {
  private client: Redis;
  public prefix: string;

  /**
   * Creates an instance of CacheClient.
   */
  constructor(config: CacheConfig) {
    this.client = new Redis(config.url);
    this.prefix = config.prefix;
  }

  /**
   * Generates a key with the specified prefix.
   * @param {string} key - The key to be prefixed.
   * @returns {string} The prefixed key.
   */
  key(key: string): string {
    return `${this.prefix}_${key}`;
  }

  // Basic operations
  async getRaw(key: string): Promise<string | null> {
    return await this.client.get(this.key(key));
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.client.set(this.key(key), value, "EX", ttlSeconds);
    } else {
      await this.client.set(this.key(key), value);
    }
  }

  async setExAt(key: string, value: string, exat: number): Promise<void> {
    await this.client.set(this.key(key), value, "EXAT", exat);
  }

  async del(key: string): Promise<void> {
    await this.client.del(this.key(key));
  }

  async getDelRaw(key: string): Promise<string | null> {
    return await this.client.getdel(this.key(key));
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(this.key(key));
    return result === 1;
  }

  async ttl(key: string): Promise<number> {
    return await this.client.ttl(this.key(key));
  }

  async expire(key: string, seconds: number): Promise<void> {
    await this.client.expire(this.key(key), seconds);
  }

  // Pipeline operations
  async pipelineGetTtl(key: string): Promise<[string | null, number]> {
    const pipeline = this.client.pipeline();
    pipeline.get(this.key(key));
    pipeline.ttl(this.key(key));
    const results = await pipeline.exec();

    if (!results) {
      return [null, -1];
    }

    const [getResult, ttlResult] = results;
    const value = getResult?.[1] as string | null;
    const ttl = (ttlResult?.[1] as number) ?? -1;

    return [value, ttl];
  }

  // Sorted set operations
  async zadd(key: string, score: number, member: string): Promise<void> {
    await this.client.zadd(this.key(key), score, member);
  }

  async zrem(key: string, member: string): Promise<void> {
    await this.client.zrem(this.key(key), member);
  }

  async zrangeWithScores(
    key: string,
    start: number,
    stop: number,
  ): Promise<(string | number)[]> {
    return await this.client.zrange(this.key(key), start, stop, "WITHSCORES");
  }

  async zrangeByScore(
    key: string,
    min: number,
    max: number,
  ): Promise<string[]> {
    return await this.client.zrange(this.key(key), min, max, "BYSCORE");
  }

  async zcard(key: string): Promise<number> {
    return await this.client.zcard(this.key(key));
  }

  async zincrby(key: string, increment: number, member: string): Promise<void> {
    await this.client.zincrby(this.key(key), increment, member);
  }

  async zscore(key: string, member: string): Promise<number | null> {
    const result = await this.client.zscore(this.key(key), member);
    return result ? Number(result) : null;
  }

  async zremrangebyscore(key: string, min: number, max: number): Promise<void> {
    await this.client.zremrangebyscore(this.key(key), min, max);
  }

  // Typed operations with schema validation
  async get<T extends z.ZodType>(
    key: string,
    schema: T,
  ): Promise<z.infer<T> | null> {
    const value = await this.getRaw(key);
    if (!value) return null;
    try {
      const parsed = schema.parse(JSON.parse(value));
      return parsed;
    } catch (err) {
      logError(`Failed to parse cache value for key ${key}`, err);
      return null;
    }
  }

  async getDel<T extends z.ZodType>(
    key: string,
    schema: T,
  ): Promise<z.infer<T> | null> {
    const value = await this.getDelRaw(key);
    if (!value) return null;
    try {
      const parsed = schema.parse(JSON.parse(value));
      return parsed;
    } catch (err) {
      logError(`Failed to parse cache value for key ${key}`, err);
      return null;
    }
  }

  async setTyped<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const serialized = JSON.stringify(value);
    await this.set(key, serialized, ttlSeconds);
  }
}
