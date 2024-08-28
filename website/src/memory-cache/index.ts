import { getMemoryCacheClient, connectMemoryCache } from "./client";

export default interface MemoryCache {
  setVerificationToken(
    email: string,
    token: string,
    ttl: number
  ): Promise<string | null>;
  getLoginSession(id: string): Promise<string | null>;
}

export const memoryCache: MemoryCache = {
  async setVerificationToken(email, token, ttl) {
    const client = await connectMemoryCache(getMemoryCacheClient());
    try {
      const res = await client.set(email, token, { EX: ttl });
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
};
