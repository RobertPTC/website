import client from "./client";

export default interface MemoryCache {
  setVerificationToken(
    email: string,
    token: string,
    ttl: number
  ): Promise<string | null>;
}

export const memoryCache: MemoryCache = {
  async setVerificationToken(email, token, ttl) {
    if (client) {
      return client.set(email, token, { EX: ttl });
    }
    throw new Error("redis client not instantiated");
  },
};
