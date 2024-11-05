import Redis from "ioredis";
import { REDIS_URL } from "../config/superChain/constants";
const redis = new Redis(REDIS_URL + '?family=0');

redis
  .ping()
  .then((result) => {
    console.log("Redis connection successful:", result);
  })
  .catch((err) => {
    console.error("Redis connection failed:", err);
  });

export { redis };
