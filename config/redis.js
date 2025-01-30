import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  retryStrategy: (times) => {
    return Math.min(times * 100, 3000); // Retry with backoff
  },
  connectTimeout: 10000, // 10-second timeout
});

redis.on('error', (err) => {
  console.error('Redis error:', err);
});

export default redis;