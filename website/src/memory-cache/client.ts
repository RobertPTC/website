import { createClient, RedisClientType } from "redis";

let client: RedisClientType | null = null;
let isConnected = false;

export function getMemoryCacheClient() {
  if (!client) {
    client = createClient({
      url: process.env.REDIS_URL,
    });
  }
  return client;
}

export async function connectMemoryCache(client: RedisClientType) {
  if (!isConnected) {
    isConnected = true;
    client.on("error", (e) => {
      console.log("memory cache client error ", e);
    });
    client.on("connection", () => {
      console.log("connection established");
    });
    await client.connect();
  }
  return client;
}
