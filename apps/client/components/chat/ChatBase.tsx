"use client";

import { useState } from "react"
import { ChatInputArea } from "./ChatInputArea"
import { useChat } from "@/hooks/useChat";
import { MessageList } from "./MessageList";

export const ChatBase = ({ podId }: { podId: string }) => {
    const [messageText, setMessageText] = useState("");
    const {
        messages,
        sendMessage,
        MAX_MESSAGE_LENGTH
    } = useChat(podId)

    const handleSendMessage = () => {
        if (!messageText.trim || messageText.length > MAX_MESSAGE_LENGTH) return;

        sendMessage(messageText);
        setMessageText("");
    }

    const handleGIF = (gifUrl: string) => {
        return (
            sendMessage(gifUrl)
        )
    }

    return (
        <div className="h-full flex flex-col overflow-x-hidden overflow-y-hidden bg-black">
            <MessageList messages={messages} />
            <ChatInputArea messageText={messageText} setMessageText={setMessageText} handleSendMessage={handleSendMessage} maxMessageLength={MAX_MESSAGE_LENGTH} handleGif={handleGIF} />
        </div>
    )
}