import Redis from "ioredis";
import {
  REDIS_URL,
  REDIS_PASSWORD,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_USER,
} from "../config/superChain/constants";
console.debug("REDIS_URL", REDIS_URL);

const redis = new Redis(REDIS_URL);

export { redis };
