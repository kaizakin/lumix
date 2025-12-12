"use client";

import { useState } from "react"
import { ChatInputArea } from "./ChatInputArea"

const MAX_MESSAGE_LENGTH = 500;

export const ChatBase = () => {
    const [messageText, setMessageText] = useState("");

    const handleSendMessage = () => {
        if(!messageText.trim || messageText.length > MAX_MESSAGE_LENGTH) return;

        // sendMessage(messageText);

        setMessageText("");
    }
    return (
        <div className="h-full flex flex-col overflow-x-hidden overflow-y-hidden">
            <ChatInputArea messageText={messageText} setMessageText={setMessageText} handleSendMessage={handleSendMessage} maxMessageLength={500} />
        </div>
    )
}