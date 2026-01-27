"use client"

import { getSocket } from "@/lib/socket.config";
import { createContext, useContext, useEffect, useState } from "react";
import { Socket } from "socket.io-client"

interface podSocketContextType {
    socket: Socket | null;
    isConnected: boolean
}

const podSocketContext = createContext<podSocketContextType>({
    socket: null,
    isConnected: false
})

export const usePodSocket = () => useContext(podSocketContext);

export function PodSocketProvider({ podId, children }: { podId: string, children: React.ReactNode }) {
    const [isConnected, setIsConnected] = useState(false);

    const socket = getSocket();

    useEffect(() => {
        socket.auth = { pod: podId }

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

    return <podSocketContext.Provider value={{ socket, isConnected }}>
        {children}
    </podSocketContext.Provider>
}