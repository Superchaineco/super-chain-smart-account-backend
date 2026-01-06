import { redis, redisClient } from '../utils/cache';

export class RedisService {
  private readonly LOCK_PREFIX: string = 'lock:';
  private readonly DEFAULT_LOCK_TTL_SECONDS: number = 15;
  private readonly DEFAULT_WAIT_MAX_MS: number = 2_000;
  private readonly DEFAULT_WAIT_STEP_MS: number = 75;

  private buildLockKey(key: string): string {
    return `${this.LOCK_PREFIX}${key}`;
  }

  private async sleep(ms: number): Promise<void> {
    await new Promise<void>((resolve) => setTimeout(resolve, ms));
  }

  private getJitterMs(maxJitterMs: number): number {
    return Math.floor(Math.random() * maxJitterMs);
  }

  public async getCachedDataWithCallback<T>(
    key: string,
    fetchFunction: () => Promise<T>,
    ttl: number,
    log: boolean = false
  ): Promise<T> {
    try {
      const cachedData: string | null = await redis.get(key);
      if (cachedData) {
        if (log) console.info(`Cache hit for key: ${key}`);
        return JSON.parse(cachedData) as T;
      }

      const lockKey: string = this.buildLockKey(key);
      const lockValue: string = `${process.pid}-${Date.now()}-${Math.random()}`;

      // Try to become the single "leader" who will compute & fill the cache
      const lockAcquired: string | null = await redis.set(
        lockKey,
        lockValue,
        'NX',
        'EX',
        this.DEFAULT_LOCK_TTL_SECONDS
      );

      if (!lockAcquired) {
        // Another request is already computing this key.
        // Wait a bit and poll the cache until it appears (or timeout).
        const startedAt: number = Date.now();

        while (Date.now() - startedAt < this.DEFAULT_WAIT_MAX_MS) {
          const retryCachedData: string | null = await redis.get(key);
          if (retryCachedData) {
            if (log) console.info(`Cache filled while waiting for key: ${key}`);
            return JSON.parse(retryCachedData) as T;
          }

          const waitMs: number =
            this.DEFAULT_WAIT_STEP_MS + this.getJitterMs(50);
          await this.sleep(waitMs);
        }

        // If we still don't have cache after waiting, last resort: try to compute anyway.
        // This prevents permanent 500s if the leader crashed before writing cache.
        if (log) console.warn(`Cache wait timeout for key: ${key}. Fallback to fetchFunction.`);
        const dataFallback: T = await fetchFunction();
        if (ttl > 0) {
          await redis.set(key, JSON.stringify(dataFallback), 'EX', ttl);
        } else {
          await redis.set(key, JSON.stringify(dataFallback));
        }
        return dataFallback;
      }

      // We are the leader: compute and fill the cache.
      try {
        const data: T = await fetchFunction();

        if (ttl > 0) {
          await redis.set(key, JSON.stringify(data), 'EX', ttl);
        } else {
          await redis.set(key, JSON.stringify(data));
        }

        return data;
      } finally {
        // Release lock safely (only if still ours)
        const releaseScript: string = `
          if redis.call("get", KEYS[1]) == ARGV[1] then
            return redis.call("del", KEYS[1])
          else
            return 0
          end
        `;
        await redis.eval(releaseScript, 1, lockKey, lockValue);
      }
    } catch (error) {
      console.error('Error getting cached data', error);
      throw error;
    }
  }

  public async setCachedData(key: string, data: any, ttl: number): Promise<void> {
    if (ttl) await redis.set(key, JSON.stringify(data), 'EX', ttl);
    else await redis.set(key, JSON.stringify(data));
  }

  public async getCachedData(key: string): Promise<any> {
    const cachedData: string | null = await redis.get(key);
    if (cachedData) {
      return JSON.parse(cachedData);
    }
    return null;
  }

  public async deleteCachedData(key: string): Promise<void> {
    await redis.del(key);
  }

  public async JSONGet(key: string, path: string): Promise<any> {
    const result: any = await redisClient.json.get(key, { path });
    return result;
  }
}

export const redisService: RedisService = new RedisService();
