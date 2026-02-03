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

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000"],
        methods: ["GET", "POST"],
        credentials: true
    },
    adapter: createAdapter(redis),
    path: "/chat"
})

app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true
}))

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


SetupSocket(io);
export { io }; 