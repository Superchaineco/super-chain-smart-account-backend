import Redis from "ioredis";
import { REDIS_URL } from "../config/superChain/constants";

const redis = new Redis(REDIS_URL);

export { redis };
