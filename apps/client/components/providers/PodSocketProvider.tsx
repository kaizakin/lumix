"use client"

import { getSocket } from "@/lib/socket.config";
import { createContext, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client"
import { useSession } from "next-auth/react"

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
        if (session && !userId) return; // Wait for session to load if possible, or handle guest

        socket.auth = { pod: podId, userId }

        if (!socket.connected) {
            socket.connect();
        }

        function onConnect() {
            setIsConnected(true)
        }

        function onDisconnect() {
            setIsConnected(false)
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect)

        return () => {
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);

            if (socket.connected) {
                socket.disconnect();
            }
        }

    }, [podId])

    return <podSocketContext.Provider value={{ socket, isConnected, podId }}>
        {children}
    </podSocketContext.Provider>
}