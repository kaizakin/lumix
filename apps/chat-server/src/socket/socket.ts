import { Server, Socket } from "socket.io";
import redis from "../redis/redis.js";
import { prisma } from "@repo/db";
import type { ChatMessage, ChatMessageDBRecord, SendMessageData } from "@repo/types";
import * as Y from "yjs";


// Redis cache expiry time (24 hours)
const CACHE_EXPIRY = 60 * 60 * 24;
const EDITOR_PERSIST_DEBOUNCE_MS = 1200;
const CANVAS_PERSIST_DEBOUNCE_MS = 1200;

interface CustomSocket extends Socket {
    pod?: string;
    userId?: string;
}

interface FetchMessagesData {
    pod: string;
}

const docs = new Map<string, Y.Doc>();
const canvasSnapshots = new Map<string, unknown[]>();
const DEBUG_EDITOR_SYNC = process.env.DEBUG_EDITOR_SYNC === "1";
const editorPersistTimers = new Map<string, NodeJS.Timeout>();
const canvasPersistTimers = new Map<string, NodeJS.Timeout>();

function normalizeYjsUpdate(update: unknown): Uint8Array | null {
    if (!update) return null;
    if (update instanceof Uint8Array) return update;
    if (Array.isArray(update)) return Uint8Array.from(update);
    if (update instanceof ArrayBuffer) return new Uint8Array(update);
    if (typeof Buffer !== "undefined" && Buffer.isBuffer(update)) return new Uint8Array(update);
    if (typeof update === "object") {
        const maybeBuffer = update as { type?: string; data?: number[] };
        if (maybeBuffer.type === "Buffer" && Array.isArray(maybeBuffer.data)) {
            return Uint8Array.from(maybeBuffer.data);
        }
    }
    return null;
}

function getPodIdFromEditorRoom(roomId: string): string | null {
    if (!roomId.startsWith("editor:")) return null;
    const podId = roomId.slice("editor:".length).trim();
    return podId || null;
}

function getPodIdFromCanvasRoom(roomId: string): string | null {
    if (!roomId.startsWith("canvas:")) return null;
    const podId = roomId.slice("canvas:".length).trim();
    return podId || null;
}

function normalizeCanvasSnapshotPayload(payload: unknown): unknown[] | null {
    if (!Array.isArray(payload)) return null;
    const normalized = payload.filter((shape) => shape && typeof shape === "object");
    return normalized;
}

async function loadPersistedEditorState(podId: string): Promise<Uint8Array | null> {
    try {
        const rows = await prisma.$queryRawUnsafe<Array<{ yjs_state: Buffer | null }>>(
            `SELECT "yjs_state" FROM "editor_documents" WHERE "pod_id" = $1 LIMIT 1`,
            podId,
        );
        const state = rows[0]?.yjs_state;
        if (!state || state.length === 0) return null;
        return new Uint8Array(state);
    } catch (error) {
        console.error(`[editor] failed loading persisted state for pod ${podId}`, error);
        return null;
    }
}

async function persistEditorState(podId: string, doc: Y.Doc): Promise<void> {
    const state = Y.encodeStateAsUpdate(doc);
    await prisma.$executeRawUnsafe(
        `INSERT INTO "editor_documents" ("pod_id", "yjs_state", "updated_at")
         VALUES ($1, $2, NOW())
         ON CONFLICT ("pod_id")
         DO UPDATE SET "yjs_state" = EXCLUDED."yjs_state", "updated_at" = NOW()`,
        podId,
        Buffer.from(state),
    );
}

async function loadPersistedCanvasState(podId: string): Promise<unknown[] | null> {
    try {
        const rows = await prisma.$queryRawUnsafe<Array<{ canvas_state: unknown }>>(
            `SELECT "canvas_state" FROM "canvas_documents" WHERE "pod_id" = $1 LIMIT 1`,
            podId,
        );
        const state = rows[0]?.canvas_state;
        if (!Array.isArray(state)) return null;
        return state;
    } catch (error) {
        console.error(`[canvas] failed loading persisted state for pod ${podId}`, error);
        return null;
    }
}

async function persistCanvasState(podId: string, snapshot: unknown[]): Promise<void> {
    await prisma.$executeRawUnsafe(
        `INSERT INTO "canvas_documents" ("pod_id", "canvas_state", "updated_at")
         VALUES ($1, $2::jsonb, NOW())
         ON CONFLICT ("pod_id")
         DO UPDATE SET "canvas_state" = EXCLUDED."canvas_state", "updated_at" = NOW()`,
        podId,
        JSON.stringify(snapshot),
    );
}

function scheduleEditorPersist(roomId: string, doc: Y.Doc): void {
    const podId = getPodIdFromEditorRoom(roomId);
    if (!podId) return;

    const previousTimer = editorPersistTimers.get(roomId);
    if (previousTimer) clearTimeout(previousTimer);

    const timer = setTimeout(async () => {
        try {
            await persistEditorState(podId, doc);
            if (DEBUG_EDITOR_SYNC) {
                console.log(`[editor] persisted pod ${podId}`);
            }
        } catch (error) {
            console.error(`[editor] failed persisting pod ${podId}`, error);
        } finally {
            editorPersistTimers.delete(roomId);
        }
    }, EDITOR_PERSIST_DEBOUNCE_MS);

    editorPersistTimers.set(roomId, timer);
}

function scheduleCanvasPersist(roomId: string, snapshot: unknown[]): void {
    const podId = getPodIdFromCanvasRoom(roomId);
    if (!podId) return;

    const previousTimer = canvasPersistTimers.get(roomId);
    if (previousTimer) clearTimeout(previousTimer);

    const timer = setTimeout(async () => {
        try {
            await persistCanvasState(podId, snapshot);
        } catch (error) {
            console.error(`[canvas] failed persisting pod ${podId}`, error);
        } finally {
            canvasPersistTimers.delete(roomId);
        }
    }, CANVAS_PERSIST_DEBOUNCE_MS);

    canvasPersistTimers.set(roomId, timer);
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
        const userId = socket.handshake.auth.userId as string | undefined;
        console.log(`Middleware: Auth pod: ${pod}, userId: ${userId}`);
        if (pod) {
            socket.pod = pod;
        }
        if (userId) {
            socket.userId = userId;
        }
        next();
    })

    io.on("connection", (socket: CustomSocket) => {
        const editorUpdateHandlers = new Map<string, (update: Uint8Array) => void>();

        if (socket.pod) {
            socket.join(socket.pod);
            console.log(`Socket ${socket.id} joined room ${socket.pod}`);
            getMessagesForPod(socket.pod)
                .then((messages => socket.emit("fetch_messages", messages)))
                .catch((error) => console.error(`error on connection ${error}`));
        } else {
            console.log(`Socket ${socket.pod} connected without a pod`);
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

        socket.on("join-editor", async (roomId: string) => {
            socket.join(roomId);
            console.log(`Socket ${socket.id} joined YJS editor: ${roomId}`);

            let doc = docs.get(roomId);
            let isNewDoc = false;
            if (!doc) {
                doc = new Y.Doc();
                docs.set(roomId, doc);
                isNewDoc = true;
                const podId = getPodIdFromEditorRoom(roomId);
                if (podId) {
                    const persistedState = await loadPersistedEditorState(podId);
                    if (persistedState) {
                        Y.applyUpdate(doc, persistedState, "db");
                        isNewDoc = false;
                    }
                }
            }

            // send initial state
            const update = Y.encodeStateAsUpdate(doc);
            socket.emit("yjs-update", Array.from(update));
            socket.emit("editor-debug", {
                phase: "join",
                roomId,
                socketId: socket.id,
                initialBytes: update.byteLength,
                isNewDoc,
            });

            const previousHandler = editorUpdateHandlers.get(roomId);
            if (previousHandler) {
                socket.off("yjs-update", previousHandler);
            }

            const yjsHandler = (update: unknown, ack?: (data: unknown) => void) => {
                const normalized = normalizeYjsUpdate(update);
                if (!normalized) {
                    if (DEBUG_EDITOR_SYNC) {
                        console.log(`[editor] invalid update payload from ${socket.id} in ${roomId}`);
                    }
                    ack?.({ ok: false, reason: "invalid-payload" });
                    return;
                }
                Y.applyUpdate(doc!, normalized);
                socket.to(roomId).emit("yjs-update", Array.from(normalized));
                scheduleEditorPersist(roomId, doc!);
                const roomSize = io.sockets.adapter.rooms.get(roomId)?.size ?? 0;
                socket.emit("editor-debug", {
                    phase: "forwarded",
                    roomId,
                    bytes: normalized.byteLength,
                    peers: Math.max(roomSize - 1, 0),
                });
                if (DEBUG_EDITOR_SYNC) {
                    console.log(`[editor] ${socket.id} -> ${roomId}: ${normalized.byteLength} bytes, peers=${Math.max(roomSize - 1, 0)}`);
                }
                ack?.({ ok: true, roomId, bytes: normalized.byteLength, peers: Math.max(roomSize - 1, 0) });
            };

            editorUpdateHandlers.set(roomId, yjsHandler);

            socket.on("yjs-update", yjsHandler);
        });

        socket.on("join-canvas", async (roomId: string) => {
            socket.join(roomId);
            let snapshot = canvasSnapshots.get(roomId);
            if (!snapshot) {
                const podId = getPodIdFromCanvasRoom(roomId);
                if (podId) {
                    const persisted = await loadPersistedCanvasState(podId);
                    snapshot = persisted ?? [];
                } else {
                    snapshot = [];
                }
                canvasSnapshots.set(roomId, snapshot);
            }
            socket.emit("canvas-state", snapshot);
        });

        socket.on("canvas-update", (payload: unknown) => {
            if (!payload || typeof payload !== "object") return;
            const data = payload as { roomId?: string; snapshot?: unknown };
            if (typeof data.roomId !== "string") return;
            const snapshot = normalizeCanvasSnapshotPayload(data.snapshot);
            if (!snapshot) return;

            canvasSnapshots.set(data.roomId, snapshot);
            socket.to(data.roomId).emit("canvas-state", snapshot);
            scheduleCanvasPersist(data.roomId, snapshot);
        });

        socket.on("disconnect", () => {
            for (const handler of editorUpdateHandlers.values()) {
                socket.off("yjs-update", handler);
            }
            editorUpdateHandlers.clear();
            console.log(`client with socketId ${socket.id} disconnected`);
        });
    });
}
