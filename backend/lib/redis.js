import Redis from "ioredis"
import dotenv from "dotenv";
dotenv.config();
export const client = new Redis(process.env.UPSTACH_URL);
// await client.set('foo', 'bar'); 