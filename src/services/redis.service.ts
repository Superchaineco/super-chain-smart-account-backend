import { json } from 'express';
import { get } from 'http';
import { redis, redisClient } from '../utils/cache';

export class RedisService {
  constructor() {
    this.initialize();
  }

  protected async initialize() {
    await redisClient.connect();
  }

  public async getCachedDataWithCallback<T>(
    key: string,
    fetchFunction: () => Promise<T>,
    ttl: number
  ): Promise<T> {
    try {
      const cachedData = await redis.get(key);
      if (cachedData) {
        console.info(`Cache hit for key: ${key}`);
        return JSON.parse(cachedData);
      }

      const data = await fetchFunction();

      if (ttl > 0) {
        await redis.set(key, JSON.stringify(data), 'EX', ttl);
      }
      return data;
    } catch (error) {
      console.error('Error getting cached data', error);
      throw error;
    }
  }

  public async setCachedData(key: string, data: any, ttl: number) {
    await redis.set(key, JSON.stringify(data), 'EX', ttl);
  }

  public async getCachedData(key: string) {
    const cachedData = await redis.get(key);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    return null;
  }
  public async deleteCachedData(key: string) {
    await redis.del(key);
  }

  public async JSONGet(key: string, path: string) {
    const result = await redisClient.json.get(key, {
      path,
    });
    return result;
  }

}

export const redisService = new RedisService();
