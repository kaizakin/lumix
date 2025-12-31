import { Bell, Search } from "lucide-react"
import { Input } from "./ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { useState } from "react"
import { CreatePodDialog } from "./CreatePodDialog"

export const DashboardHeader = () => {
    const [notificationCount] = useState(3);

    return (
        <div className="flex h-20 items-center justify-between">
            <div>
                <span className="text-white text-3xl font-bold">Welcome back to </span><span className="text-light1 text-3xl font-semibold">Lumix</span>
                <p className="text-light1 text-sm font-semibold">Your collaborative workspace for realtime brainstorming</p>
            </div>
            <div className="flex gap-4">
                <div className="relative hidden md:block">
                    <Search className="absolute left-3 h-4 w-4 top-1/2 -translate-y-1/2" />
                    <Input placeholder="Search pods..." className="pl-9 w-[250px] focus:w-[300px] transition-all rounded-none" />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="relative bg-card transition-all hover:bg-light1"
                        >
                            <Bell className="h-5 w-5" />
                            {notificationCount > 0 && (
                                <Badge
                                    variant="destructive"
                                    className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs animate-in fade-in zoom-in"
                                >
                                    {notificationCount}
                                </Badge>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-primary" />
                                <span className="font-medium">New member joined Pod Alpha</span>
                            </div>
                            <span className="text-xs text-muted-foreground">2 minutes ago</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-primary" />
                                <span className="font-medium">Deadline approaching: Q4 Review</span>
                            </div>
                            <span className="text-xs text-muted-foreground">1 hour ago</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-primary" />
                                <span className="font-medium">5 new files shared in Design Pod</span>
                            </div>
                            <span className="text-xs text-muted-foreground">3 hours ago</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            <CreatePodDialog/>
            </div>
        </div>
    )
}