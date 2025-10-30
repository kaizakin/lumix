import { AvatarFallback } from "@radix-ui/react-avatar"
import { Avatar, AvatarImage } from "../ui/avatar"
import { ScrollArea } from "../ui/scroll-area"
import { Input } from "../ui/input"
import { useState } from "react"
import { Button } from "../ui/button"
import { Send } from "lucide-react"

export const PodSidebarChat = () => {
    const [input, setInput] = useState("");
    const [chatMessages, setChatMessages] = useState([
        {
            id: 1,
            user: "Karthik Balasubramanian",
            message: "Great ideas on the whiteboard! Love the user flow concept.",
            time: "2:34 PM",
            avatar: "/monkey.jpg",
        },
        {
            id: 2,
            user: "Mike Johnson",
            message: "Should we add the API integration timeline to the calendar?",
            time: "2:35 PM",
            avatar: "",
        },
        {
            id: 3,
            user: "Alex Chen",
            message: "Yes, let's schedule that for next sprint. I'll add it now.",
            time: "2:36 PM",
            avatar: "/professional-person.png",
        },
        {
            id: 4,
            user: "Karthik Balasubramanian",
            message: "Great ideas on the whiteboard! Love the user flow concept.",
            time: "2:34 PM",
            avatar: "/monkey.jpg",
        },
        {
            id: 5,
            user: "Mike Johnson",
            message: "Should we add the API integration timeline to the calendar?",
            time: "2:35 PM",
            avatar: "",
        },
        {
            id: 6,
            user: "Alex Chen",
            message: "Yes, let's schedule that for next sprint. I'll add it now.",
            time: "2:36 PM",
            avatar: "/professional-person.png",
        },
        {
            id: 7,
            user: "Karthik Balasubramanian",
            message: "Great ideas on the whiteboard! Love the user flow concept.",
            time: "2:34 PM",
            avatar: "/monkey.jpg",
        },
        {
            id: 8,
            user: "Mike Johnson",
            message: "Should we add the API integration timeline to the calendar?",
            time: "2:35 PM",
            avatar: "",
        },
        {
            id: 9,
            user: "Alex Chen",
            message: "Yes, let's schedule that for next sprint. I'll add it now.",
            time: "2:36 PM",
            avatar: "/professional-person.png",
        },
        {
            id: 10,
            user: "Karthik Balasubramanian",
            message: "Great ideas on the whiteboard! Love the user flow concept.",
            time: "2:34 PM",
            avatar: "/monkey.jpg",
        },
        {
            id: 11,
            user: "Mike Johnson",
            message: "Should we add the API integration timeline to the calendar?",
            time: "2:35 PM",
            avatar: "",
        },
        {
            id: 12,
            user: "Alex Chen",
            message: "Yes, let's schedule that for next sprint. I'll add it now.",
            time: "2:36 PM",
            avatar: "/professional-person.png",
        }
    ])

    return <div className="flex flex-col h-full">
        <ScrollArea className="flex-1 p-4 overflow-auto scrollbar-custom-thin">
            <div className="space-y-4">
                {chatMessages.map(msg => (
                    <div key={msg.id} className="flex space-x-3">
                        <Avatar className="w-6 h-6">
                            <AvatarImage src={msg.avatar || "/placeholder.jpg"} alt="LU" />
                            <AvatarFallback className="text-xs">
                                {msg.user.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium">{msg.user}</span>
                                <span className="text-xs text-muted-foreground">{msg.time}</span>
                            </div>
                            <p className="text-sm text-pretty">{msg.message}</p>
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
        <div className="mt-1 p-2 border-t border-border">
                <div className="flex space-x-2">
                    <Input
                    className="flex-1"
                    placeholder="Type a message..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    />
                    <Button
                    size="sm"
                    className="bg-blue-500 dark:bg-blue-500 cursor-pointer hover:bg-green-400/50 dark:hover:bg-green-400/80"
                    >
                        <Send className="w-4 h-4"/>
                    </Button>
                </div>
        </div>
    </div>
}