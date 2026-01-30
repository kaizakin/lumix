import { Bell } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { useState } from "react"
import { CreatePodDialog } from "./CreatePodDialog"

export const DashboardHeader = () => {
    const [notificationCount] = useState(2);

    return (
        <div className="flex flex-col md:flex-row gap-4 md:gap-0 md:h-20 md:items-center md:justify-between py-4 md:py-0">
            <div className="flex-1">
                <div className="flex flex-wrap items-center gap-1">
                    <span className="text-white text-xl sm:text-2xl md:text-3xl font-bold">Welcome back to </span><span className="text-light1 text-xl sm:text-2xl md:text-3xl font-semibold">Lumix</span>
                </div>
                <p className="text-light1 text-xs sm:text-sm font-semibold mt-2 md:mt-0">Your collaborative workspace for realtime brainstorming</p>
            </div>
            <div className="flex gap-2 md:gap-4 items-center flex-shrink-0">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="relative bg-card transition-all hover:bg-light1 h-9 w-9 md:h-10 md:w-10"
                        >
                            <Bell className="h-4 w-4 md:h-5 md:w-5" />
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
                    <DropdownMenuContent align="end" className="w-72 sm:w-80">
                        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-primary" />
                                <span className="font-medium text-xs sm:text-sm">Welcome onboard. Your workspace is prepped and ready for chaos</span>
                            </div>
                            <span className="text-xs text-muted-foreground">1 minute ago</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-primary" />
                                <span className="font-medium text-xs sm:text-sm">Create a pod and start brainstorming already!</span>
                            </div>
                            <span className="text-xs text-muted-foreground">1 minute ago</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <CreatePodDialog />
            </div>
        </div>
    )
}