import { createClient } from 'redis';

const client = createClient({
    username: 'default',
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: 10776
    }
});

client.on('error', err => console.log('Redis Client Error', err));

await client.connect();