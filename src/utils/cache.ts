import Redis from "ioredis";
import { REDIS_URL } from "../config/superChain/constants";

const redis = new Redis(REDIS_URL);

redis
  .ping()
  .then((result) => {
    console.log("Redis connection successful:", result);
  })
  .catch((err) => {
    console.error("Redis connection failed:", err);
  });

export { redis };
