import Redis from "ioredis";
import {
  REDIS_URL,
  REDIS_PASSWORD,
  REDIS_HOST,
  REDIS_PORT,
  REDIS_USER,
} from "../config/superChain/constants";
console.debug("REDIS_URL", REDIS_URL);
const redis = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
  username: REDIS_USER,
  password: REDIS_PASSWORD,
  family: 0,
});

export { redis };
