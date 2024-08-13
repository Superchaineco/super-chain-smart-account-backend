import Redis from "ioredis";
import { REDIS_URL } from "../config/superChain/constants";
console.debug("REDIS_URL", REDIS_URL);
const redis = new Redis(REDIS_URL);

export { redis };
