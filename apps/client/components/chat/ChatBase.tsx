"use client";

import { useState } from "react"
import { ChatInputArea } from "./ChatInputArea"
import { useChat } from "@/hooks/useChat";
import { MessageList } from "./MessageList";
import Image from "next/image";


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
            sendMessage(<div className="flex justify-center items-center w-full overflow-hidden my-1">
                <Image
                    width={200}
                    height={200}
                    src={gifUrl}
                    alt="GIF"
                    className="w-full h-auto rounded-md"
                    loading="lazy"
                    style={{
                        minWidth: '220px',
                        maxHeight: '300px',
                        objectFit: 'contain',
                        display: 'block',
                        margin: 0
                    }}
                />
            </div>)
        )
    }

    return (
        <div className="h-full flex flex-col overflow-x-hidden overflow-y-hidden">
            <MessageList messages={messages} />
            <ChatInputArea messageText={messageText} setMessageText={setMessageText} handleSendMessage={handleSendMessage} maxMessageLength={MAX_MESSAGE_LENGTH} handleGif={handleGIF}/>
        </div>
    )
}