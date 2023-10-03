export interface CustomRedisClientOptions {
  host: string;
  port: number;
  password: string;
}

export const redisConfig: CustomRedisClientOptions = {
  host: "127.0.0.1",
  port: 6379,
  password: "",
};
