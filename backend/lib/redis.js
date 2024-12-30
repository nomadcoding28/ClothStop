import Redis from "ioredis"
import dotenv from "dotenv";
dotenv.config();
export const client = new Redis(process.env.UPSTACH_URL);
client.on('connect', () => console.log('Connected to Redis'));
client.on('error', (err) => console.error('Redis connection error:', err));

// await client.set('foo', 'bar'); 