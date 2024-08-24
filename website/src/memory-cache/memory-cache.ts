import { createClient } from "redis";
interface MemoryCache {
  setVerificationToken(email: string, token: string, ttl: number): void;
}
