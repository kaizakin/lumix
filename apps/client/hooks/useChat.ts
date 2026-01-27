"use client";

import { getSocket } from "@/lib/socket.config";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChatMessage } from "@repo/types"
import { toast } from "sonner";
import { usePodSocket } from "@/components/providers/PodSocketProvider";

export function useChat(podId: string) {
    const session = useSession();

    const MAX_MESSAGE_LENGTH = 500;

    const { socket, isConnected } = usePodSocket();

    const queryClient = useQueryClient();
    const optimisticIdCounter = useRef(0);

    const messagesQuery = useQuery({
        queryKey: ['messages', podId],
        queryFn: async () => {
            return new Promise<ChatMessage[]>((resolve) => {
                if (!socket) return [];
                socket.emit("fetch_messages",
                    { pod: podId },
                    (fetchedMessages: ChatMessage[]) => {
                        resolve(fetchedMessages);
                    }
                )
            })
        },
        enabled: isConnected && !!socket
    })

    function onError(error: { type: string, message: string }) {
        toast.error("Message Error", {
            description: error.message
        })
    }

    useEffect(() => {
        if (!socket) return;

        function onNewMessage(message: ChatMessage) {
            console.log("new message received")
            queryClient.setQueryData(['messages', podId],
                (oldData: ChatMessage[] | undefined) => {
                    if (!oldData) return [message]

                    const newData = [...oldData]

                    // update it if its a optimistic message.
                    const tempIndex = newData.findIndex(m =>
                        m.id.startsWith('temp-') &&
                        m.message === message.message &&
                        m.sender === message.sender
                    )
                    if (tempIndex !== -1) {
                        newData[tempIndex] = message
                        return newData;// return then and there.
                    }

                    // deduplication check if the message already exists don't duplicate it just return
                    const exists = newData.some(m => m.id === message.id)
                    if (exists) return newData;

                    return [...newData, message] // for messages sent by others just append it.
                }
            )
        }

        const currentSocket = socket;

        currentSocket.on("new_message", onNewMessage);
        currentSocket.on("error", onError);

        return () => {
            currentSocket.off("new_message", onNewMessage);
            currentSocket.off("new_message", onNewMessage);
        }
    }, [podId, queryClient, socket]);

    const sendMessageMutation = useMutation({
        mutationFn: async (messageText: string) => {
            if (!messageText.trim() || !session.data?.user) return
            if (messageText.length > MAX_MESSAGE_LENGTH) return

            const userEmail = session.data.user.email || 'unknown@example.com'

            const message = {
                message: messageText,
                pod: podId,
                sender: session.data.user.id as string,
                user: {
                    email: userEmail,
                    avatar: session.data.user.image || undefined
                }
            }

            return new Promise<void>((resolve, reject) => {
                if (!socket) throw new Error("socket not connected!");

                socket.emit("send_message", message, (error: any) => {
                    if (error) {
                        reject(error)
                    } else {
                        resolve()
                    }
                })
            })
        },
        onMutate: async (messageText) => {
            await queryClient.cancelQueries({ queryKey: ['messages', podId] })
            if (!session?.data?.user) return
            const userEmail = session.data.user.email || 'unknown@example.com'

            const uniqueId = `temp-${Date.now()}-${optimisticIdCounter.current++}`

            const optimisticMessage: ChatMessage = {
                id: uniqueId,
                message: messageText,
                pod: podId,
                sender: session.data.user.id as string,
                createdAt: new Date().toISOString(),
                user: {
                    email: userEmail,
                    avatar: session.data.user.image || undefined
                }
            }

            queryClient.setQueryData(['messages', podId], (oldData: ChatMessage[] | undefined) => {
                return oldData ? [...oldData, optimisticMessage] : [optimisticMessage]
            })
        },
        onError: (error) => {
            toast.error("Failed to send message", {
                description: error instanceof Error ? error.message : 'Unknown error'
            })
            // Revert the optimistic update on error by refetching
            queryClient.invalidateQueries({ queryKey: ['messages', podId] })
        },
    })

    const sendMessage = (messageText: string | React.ReactElement) => {
        sendMessageMutation.mutate(messageText as string);
    }

    return {
        messages: messagesQuery.data || [],
        isLoading: messagesQuery.isLoading,
        isConnected,
        sendMessage,
        MAX_MESSAGE_LENGTH
    }
}