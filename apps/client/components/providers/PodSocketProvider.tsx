"use client"

import { getSocket } from "@/lib/socket.config";
import { createContext, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client"
import { useSession } from "next-auth/react"
const DEBUG_EDITOR_SYNC = process.env.NEXT_PUBLIC_DEBUG_EDITOR_SYNC === "1";

interface podSocketContextType {
    socket: Socket | null;
    isConnected: boolean;
    podId: string | null;
}

const podSocketContext = createContext<podSocketContextType>({
    socket: null,
    isConnected: false,
    podId: null
})

export const usePodSocket = () => useContext(podSocketContext);

export function PodSocketProvider({ podId, children }: { podId: string, children: React.ReactNode }) {
    const [isConnected, setIsConnected] = useState(false);

    const socket = getSocket();

    const { data: session } = useSession();
    const userId = session?.user?.id;

    useEffect(() => {
        if (session && !userId) return;

        const previousAuth = socket.auth as { pod?: string; userId?: string } | undefined;
        const authChanged =
            previousAuth?.pod !== podId ||
            previousAuth?.userId !== userId;

        socket.auth = { pod: podId, userId };

        function onConnect() {
            setIsConnected(true);
        }

        function onDisconnect() {
            setIsConnected(false);
        }
        function onConnectError(error: Error) {
            if (DEBUG_EDITOR_SYNC) {
                console.error("[socket-debug] connect_error", error.message);
            }
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("connect_error", onConnectError);

        if (!socket.connected || authChanged) {
            if (socket.connected && authChanged) {
                socket.disconnect();
            }
            socket.connect();
        }

        setIsConnected(socket.connected);

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("connect_error", onConnectError);

        }

    }, [podId, userId, socket])

    return <podSocketContext.Provider value={{ socket, isConnected, podId }}>
        {children}
    </podSocketContext.Provider>
}
