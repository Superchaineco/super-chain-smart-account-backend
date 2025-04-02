import Redis from 'ioredis';
import { REDIS_URL } from '../config/superChain/constants';
import { createClient } from 'redis';
const redis = new Redis(REDIS_URL + '?family=0');

// This is technical debt, we should use a redis client that supports the JSON.GET command
const redisClient = createClient({ url: REDIS_URL + '?family=0' });
redisClient.on('error', (err) => console.error('Redis Client Error', err));

redis
  .ping()
  .then((result) => {
    console.log('Redis connection successful:', result);
  })
  .catch((err) => {
    console.error('Redis connection failed:', err);
  });

export { redis, redisClient };


