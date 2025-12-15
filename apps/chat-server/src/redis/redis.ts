import { Redis } from "ioredis"
let redis: Redis

// use production redis if exists or use a local one.
if (process.env.NODE_ENV == "production") {
    if (process.env.REDIS_URL) {
        redis = new Redis(process.env.REDIS_URL);
    } else {
        throw new Error("Redis URL not configured in production environment");
    }
} else {
    redis = new Redis({
        host: "localhost",
        port: 6379
    })
    console.log("using localhost redis!");
}

export default redis;