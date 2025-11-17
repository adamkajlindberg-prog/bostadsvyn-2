import { getCache } from "../cache";

interface SecondaryStorage {
  get: (key: string) => Promise<unknown>;
  set: (key: string, value: string, ttl?: number) => Promise<void>;
  delete: (key: string) => Promise<void>;
}

export const cacheAdapter: SecondaryStorage = {
  delete: async (key) => {
    try {
      const cacheClient = getCache();
      await cacheClient.del(key);
    } catch (err) {
      console.warn("Cache delete operation failed:", JSON.stringify(err));
    }
  },
  get: async (key) => {
    try {
      const cacheClient = getCache();
      const value = await cacheClient.getRaw(key);
      return value ? value : null;
    } catch (err) {
      console.warn("Cache get operation failed:", JSON.stringify(err));
      return null;
    }
  },
  set: async (key, value, ttl) => {
    try {
      const cacheClient = getCache();
      if (ttl) {
        await cacheClient.set(key, value, ttl);
      } else {
        await cacheClient.set(key, value);
      }
    } catch (err) {
      console.warn("Cache set operation failed:", JSON.stringify(err));
    }
  },
};
