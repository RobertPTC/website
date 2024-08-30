import { getMemoryCacheClient, connectMemoryCache } from "./client";

export default interface MemoryCache {
  setVerificationToken(
    id: string,
    token: string,
    ttl: number
  ): Promise<string | null>;
  getLoginSession(id: string): Promise<string | null>;
  setSessionID(id: string, email: string, ttl: number): Promise<string | null>;
  getEmailForSessionID(id: string): Promise<string | null>;
}

export const memoryCache: MemoryCache = {
  async setVerificationToken(id, token, ttl) {
    try {
      const client = await connectMemoryCache(getMemoryCacheClient());
      const res = await client.set(id, token, { EX: ttl });
      return res;
    } catch (error) {
      console.error("error setting verification token ", error);
      return null;
    }
  },
  async getLoginSession(id) {
    const client = await connectMemoryCache(getMemoryCacheClient());
    return await client.get(id);
  },
  async setSessionID(id, email, ttl) {
    try {
      const client = await connectMemoryCache(getMemoryCacheClient());
      const res = await client.set(id, email, { EX: ttl });
      return res;
    } catch (error) {
      console.error("error", error);
      return null;
    }
  },
  async getEmailForSessionID(id) {
    const client = await connectMemoryCache(getMemoryCacheClient());
    return await client.get(id);
  },
};
