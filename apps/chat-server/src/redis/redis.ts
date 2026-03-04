import { Redis } from "ioredis"
let redis: Redis

const redisUrl = process.env.REDIS_URL;

if (redisUrl) {
    redis = new Redis(redisUrl);
} else {
    // Local fallback for non-containerized runs.
    redis = new Redis({
        host: process.env.REDIS_HOST ?? "localhost",
        port: Number(process.env.REDIS_PORT ?? 6379)
    })
    console.log(`Using redis fallback host ${process.env.REDIS_HOST ?? "localhost"}:${process.env.REDIS_PORT ?? 6379}`);
}

redis.on("error", (error) => {
    console.error("[redis] connection error:", error.message);
});

export default redis;
