import client from "./client";

export interface MemoryCache {
  setVerificationToken(
    email: string,
    token: string,
    ttl: number
  ): Promise<null | string>;
}

const memoryCache: MemoryCache = {
  async setVerificationToken(email, token, ttl) {
    if (client) {
      return client.set(email, token, { EX: ttl });
    }
    return null;
  },
};

export default memoryCache;
