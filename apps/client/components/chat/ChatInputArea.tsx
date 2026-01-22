"use client";

import { ImageIcon, Send, Smile } from "lucide-react"
import { Button } from "../ui/button"
import { ChatInput } from "../ui/chat-input"
import { useState } from "react"
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import GifPicker, { Theme } from "gif-picker-react";

interface ChatInputAreaProps {
    messageText: string,
    setMessageText: React.Dispatch<React.SetStateAction<string>>,
    handleSendMessage: () => void,
    maxMessageLength: number
    handleGif: (x: string)=> void
}


export const ChatInputArea = ({
    messageText,
    setMessageText,
    handleSendMessage,
    maxMessageLength,
    handleGif
}: ChatInputAreaProps) => {

    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [showGifPicker, setShowGifPicker] = useState(false)

    const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value
        if (value.length <= maxMessageLength) {
            setMessageText(value)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    function onEmojiClick(emoji: any) {
        setMessageText((prevText: string) => prevText + emoji.native);

        setShowEmojiPicker(false)
    }

    return (
        <div className="border-t border-border p-2 mt-auto bg-black z-10">
            <div className="flex flex-col gap-1">
                <div className="flex gap-2">
                    <div className="flex-1 relative">
                        <ChatInput
                            value={messageText}
                            onChange={handleMessageChange}
                            onKeyDown={handleKeyDown}
                            placeholder="Type a message..."
                            className="flex-1 pl-20 min-h-0 overflow-hidden"
                            maxLength={maxMessageLength}
                        />
                        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => {
                                    setShowEmojiPicker(!showEmojiPicker)
                                    setShowGifPicker(false)
                                }}
                            >
                                <Smile className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => {
                                    setShowGifPicker(!showGifPicker)
                                    setShowEmojiPicker(false)
                                }}
                            >
                                <ImageIcon className="h-4 w-4" />
                            </Button>
                        </div>
                        {showEmojiPicker && (
                            <div className="absolute bottom-full left-0 mb-2">
                                <Picker
                                    data={data}
                                    onEmojiSelect={onEmojiClick}
                                    previewPosition="none"
                                    searchPosition="sticky"
                                    theme="dark"
                                    skinTonePosition="search"
                                    autoFocus={true}
                                />
                            </div>
                        )}
                        {showGifPicker && (
                            <div className="absolute bottom-full left-0 mb-2 bg-black border rounded-lg p-0 w-[280px] h-[380px] overflow-hidden shadow-lg z-50">
                                <div className="text-sm h-full">
                                    <GifPicker
                                        tenorApiKey={process.env.NEXT_PUBLIC_TENOR_API_KEY || ''}
                                        onGifClick={(gif) => {
                                            handleGif(gif.url)
                                            setShowGifPicker(false)
                                        }}
                                        width={280}
                                        height={380}
                                        theme={Theme.DARK}
                                    />
                                </div>
                            </div>
                        )}
                        <div className="absolute right-2 top-1/2 translate -translate-y-1/2">
                            <div className="text-xs text-muted-foreground text-right">
                                {messageText.length}/{maxMessageLength}
                            </div>
                        </div>
                    </div>
                    <Button
                        onClick={handleSendMessage}
                        size="icon"
                        disabled={!messageText.trim() || messageText.length > maxMessageLength}
                    >
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}