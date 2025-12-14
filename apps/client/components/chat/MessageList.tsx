import { ChatMessage } from "@repo/types";
import { useSession } from "next-auth/react";
import { useEffect, useRef } from "react";
import { MessageItem } from "./MessageItem";

interface messageListProps {
  messages: ChatMessage[]
}

export function MessageList({ messages }: messageListProps) {
  const { data: session } = useSession();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 pb-2 mb-0 scrollbar-custom-thin">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          No messages yet. Start a conversation!
        </div>
      ) : (
        <div className="space-y-4 max-w-full">
          {messages.map((message) => {
            if (!message || !message.id) return null

            const isOwn = message.sender === (session?.user?.id as string)
            return (
              <MessageItem
                key={message.id}
                message={message}
                isOwn={isOwn}
                sessionUserAvatar={session?.user?.image as string}
              />
            )
          })}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  )

}