import { createClient } from 'redis';

const redis = createClient({
  url: `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`,
  password: process.env.REDIS_PASSWORD,
  socket: {
    connectTimeout: 10000, // 10 seconds timeout
  },
});

redis.on('error', (err) => {
  console.error('Redis connection error:', err);
});

await redis.connect();

export default redis;