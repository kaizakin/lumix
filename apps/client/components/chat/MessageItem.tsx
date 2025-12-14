import { ChatMessage } from "@repo/types"
import { format } from "date-fns";
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "../ui/chat-bubble";
import { cn } from "@/lib/utils";

interface MessageItemProps {
    message: ChatMessage
    isOwn: boolean
    sessionUserAvatar?: string
}

export function MessageItem({ isOwn, message, sessionUserAvatar }: MessageItemProps) {

    const formatMessageTime = (timestamp?: string) => {
        if (!timestamp) return "";
        const date = new Date(timestamp);
        return format(date, "MMM d, h:mm a");
    };

    return (
        <ChatBubble variant={isOwn ? "sent" : "received"}>
            {!isOwn ? (
                <ChatBubbleAvatar
                    src={message.user?.avatar}
                    className="h-10 w-10"
                />
            ) : (
                <ChatBubbleAvatar
                    className="h-10 w-10"
                    src={sessionUserAvatar}
                />
            )}
            <div className={cn(
                "flex flex-col max-w-full",
                isOwn && "items-end"
            )}>
                <span className={cn(
                    "text-xs text-muted-foreground mb-1",
                    isOwn ? "mr-1" : "ml-1"
                )}>
                    {message.user?.email || 'Unknown User'}
                </span>
                <ChatBubbleMessage variant={isOwn ? "sent" : "received"}>
                    {message.message}
                </ChatBubbleMessage>
                <span className={`text-xs text-muted-foreground mt-1 ${isOwn ? "self-end" : "self-start"}`}>
                    {formatMessageTime(message.createdAt)}
                </span>
            </div>
        </ChatBubble>
    )
}