import { io, Socket } from "socket.io-client"
import Env from "./env";

let socket: Socket;

function resolveBackendUrl(): string {
    const configured = Env.BACKEND_URL;
    if (typeof window === "undefined") return configured;
    const host = window.location.hostname;

    // If app is opened from another device but env still says localhost, point to same host on port 8080.
    if (configured?.includes("localhost") && host !== "localhost" && host !== "127.0.0.1") {
        const protocol = window.location.protocol;
        return `${protocol}//${host}:8080`;
    }

    return configured;
}

export const getSocket = (): Socket => {
    if (!socket) {
        socket = io(resolveBackendUrl(), {
            autoConnect: false,
            path: "/chat"
        })
    }

    return socket;
}
