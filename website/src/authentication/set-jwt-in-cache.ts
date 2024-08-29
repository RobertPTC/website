import { jwtMaxAge } from "@app/cookies";
import MemoryCache from "@app/memory-cache";

export default async function setJWTInCache(
  memoryCache: MemoryCache,
  id: string,
  email: string
) {
  try {
    const res = memoryCache.setSessionID(id, email, jwtMaxAge);
    return res;
  } catch (error) {
    console.log("error", error);
    return null;
  }
}
