import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';
import { createAdapter } from "@socket.io/redis-streams-adapter"
import cors from "cors";
import redis from './redis/redis.js';
import { SetupSocket } from './socket/socket.js';
import 'dotenv/config';

const PORT = 8080;
const app = express();
const server = createServer(app);
const allowedOrigins = (process.env.CORS_ORIGINS ?? "*")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

const isOriginAllowed = (origin?: string): boolean => {
    if (!origin) return true;
    if (allowedOrigins.includes("*")) return true;
    return allowedOrigins.includes(origin);
};

const io = new Server(server, {
    cors: {
        origin: (origin, callback) => {
            if (isOriginAllowed(origin)) {
                callback(null, true);
                return;
            }
            callback(new Error(`Origin not allowed by CORS: ${origin}`));
        },
        methods: ["GET", "POST"],
        credentials: true
    },
    adapter: createAdapter(redis),
    path: "/chat"
})

app.use(cors({
    origin: (origin, callback) => {
        if (isOriginAllowed(origin)) {
            callback(null, true);
            return;
        }
        callback(new Error(`Origin not allowed by CORS: ${origin}`));
    },
    credentials: true
}))

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


SetupSocket(io);
export { io }; 
