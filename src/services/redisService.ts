import { Redis } from "ioredis";
import { CustomRedisClientOptions } from "../config/redisConfig";

const redisClient = new Redis({
  host: "127.0.0.1",
  port: 6379,
  password: "",
  legacyMode: true,
} as CustomRedisClientOptions);

export async function closeRedisClient() {
  await redisClient.quit();
  console.log("Redis client has been closed.");
}

export async function sendMessagesToAllTokens(messageData: any) {
  console.log("entered sendMessagesToAllTokens");
  const redisTokens = await redisClient.smembers("web-staging:token-storage");
  const tokens = JSON.parse(redisTokens[1]);

  if (!tokens || tokens.length === 0) {
    console.log("No tokens found in Redis.");
    return;
  }

  for (const token of tokens) {
    console.log("Token:", token);
  }

  console.log("All messages sent.");
}
