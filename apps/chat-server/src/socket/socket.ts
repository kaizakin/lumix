import { Server, Socket } from "socket.io";
import redis from "../redis/redis.js";
import { prisma } from "@repo/db";
import type { ChatMessage, ChatMessageDBRecord, SendMessageData } from "@repo/types";


// Redis cache expiry time (24 hours)
const CACHE_EXPIRY = 60 * 60 * 24;

interface CustomSocket extends Socket {
    pod?: string;
}

interface FetchMessagesData {
    pod: string;
}


function formatMessage(msg: ChatMessageDBRecord): ChatMessage {
    return {
        id: msg.id,
        sender: msg.sender,
        senderAvatar: msg.userAvatar || undefined,
        message: msg.message,
        pod: msg.chatGroupId,
        createdAt: msg.createdAt.toISOString(),
        user: {
            email: msg.userEmail,
            avatar: msg.userAvatar || undefined,
        },
    };
}

async function getMessagesForPod(pod: string): Promise<ChatMessage[]> {
    const cacheKey = `chat:${pod}:messages`;
    try {
        const cached = await redis.get(cacheKey);
        if (cached) {
            console.log(`Using redis cached messages for room: ${pod}`);
            return JSON.parse(cached) as ChatMessage[];
        }
        console.log(`Cache miss for room: ${pod}, fetching from DB`);
        const messagesFromDB = await prisma.chatMessage.findMany({
            where: { chatGroupId: pod },
            orderBy: { createdAt: "asc" },
        });

        const formattedMessages = messagesFromDB.map(formatMessage);
        await redis.setex(cacheKey, CACHE_EXPIRY, JSON.stringify(formattedMessages));
        return formattedMessages;

    } catch (error) {
        console.error("Error fetching messages:", error);
        const messagesFromDB = await prisma.chatMessage.findMany({
            where: { chatGroupId: pod },
            orderBy: { createdAt: "asc" },
        });
        return messagesFromDB.map(formatMessage);
    }
}

export function SetupSocket(io: Server): void {
    io.use((socket: CustomSocket, next) => {
        const pod = socket.handshake.auth.pod as string | undefined;
        console.log(`Middleware: Auth pod: ${pod}`);
        if (pod) {
            socket.pod = pod;
        }
        next();
    })

    io.on("connection", (socket: CustomSocket) => {
        if (socket.pod) {
            socket.join(socket.pod);
            console.log(`Socket ${socket.id} joined room ${socket.pod}`);
            getMessagesForPod(socket.pod)
                .then((messages => socket.emit("fetch_messages", messages)))
                .catch((error) => console.error(`error on connection ${error}`));
        } else {
            console.log(`Socket ${socket.pod} connected without a room`);
        }

        socket.on("fetch_messages", async (data: FetchMessagesData, callback) => {
            const messages = await getMessagesForPod(data.pod);
            callback(messages);
        });

        socket.on("send_message", async (data: SendMessageData) => {
            console.log(`Received message from ${data.user.email} for room ${data.pod}`);

            const userInfo = {
                email: data.user.email || "unknown@example.com",
                avatar: data.user.avatar || null,
            };

            try {
                const user = await prisma.user.findUnique({
                    where: { email: userInfo.email }
                })

                if (!user) throw new Error(`User with email ${userInfo.email} not found`);

                //update message in DB.
                const savedMessage = await prisma.chatMessage.create({
                    data: {
                        chatGroupId: data.pod,
                        sender: data.sender,
                        message: data.message,
                        userId: user.id,
                        userEmail: userInfo.email,
                        userAvatar: userInfo.avatar,
                    },
                });
                const formattedMessage = formatMessage(savedMessage);

                const cacheKey = `chat:${data.pod}:messages`;

                // updating cache.
                try {
                    const cachedMessages = await redis.get(cacheKey);
                    let messages: ChatMessage[] = cachedMessages ? JSON.parse(cachedMessages) : [];
                    messages.push(formattedMessage);
                    await redis.setex(cacheKey, CACHE_EXPIRY, JSON.stringify(messages));
                } catch (err) {
                    console.error("Redis cache update error:", err);
                }

                io.to(data.pod).emit("new_message", formattedMessage);
                console.log(`Message broadcast to ${data.pod}`)

            } catch (error) {
                console.error("Error saving message to DB:", error);
            }
        });

        socket.on("disconnect", () => {
            console.log(`client with socketId ${socket.id} disconnected`);
        });
    });
}