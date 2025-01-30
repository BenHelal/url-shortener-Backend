import { createClient } from 'redis';

// Configure Redis
const redis = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT || 6379,  // Added default port in case it’s missing from ENV
    },
});

redis.on('error', (err) => {
  console.error('Redis Client Error', err);
});

await redis.connect();

export default redis;