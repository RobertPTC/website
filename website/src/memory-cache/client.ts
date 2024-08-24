import { createClient, RedisClientType } from "redis";

let client: RedisClientType | null = null;

async function connectMemoryCache() {
  if (!client) {
    client = createClient({
      url: process.env.REDIS_URL,
    });

    client.on("error", (err) => {
      console.log("err ", err);
    });

    client.on("connection", () => {
      console.log("connection established");
    });

    await client.connect();
  }
}

connectMemoryCache();

export default client;
