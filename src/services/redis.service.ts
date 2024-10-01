import { redis } from "../utils/cache";

export class RedisService {
    public async getCachedData<T>(key: string, fetchFunction: () => Promise<T>, ttl: number): Promise<T> {
        const cachedData = await redis.get(key);
        if (cachedData) {
            console.info(`Cache hit for key: ${key}`);
            return JSON.parse(cachedData);
        }

        const data = await fetchFunction();
        await redis.set(key, JSON.stringify(data), "EX", ttl);
        return data;
    }
}

export const redisService = new RedisService();
