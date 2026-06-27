import Redis from "ioredis";
import dotenv from "dotenv/config";



if (!process.env.REDIS_URL) {
  throw new Error("REDIS_URL is missing from .env");
}

const redis = new Redis(process.env.REDIS_URL);

redis.on("connect", () => {
  console.log("Redis connected");
}); 

redis.on("ready", () => {
  console.log("Redis ready");
});

redis.on("error", (err) => {
  console.error("Redis Error:", err);
});



export default redis;