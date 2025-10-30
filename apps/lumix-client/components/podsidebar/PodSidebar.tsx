"use client";

import { MessageSquare, Calendar, FolderOpen, X } from "lucide-react";
import { PodSidebarChat } from "./PodSidebarChat";
import { Separator } from "../ui/separator";
import { useState } from "react";
import { Button } from "../ui/button";
import { PodSidebarSchedule } from "./PodSidebarSchedule";
import { PodSidebarFiles } from "./PodSidebarFiles";

interface PodSideBarProps {
    isOpen: boolean;
    onToggle: () => void;
}

export const PodSideBar = ({ isOpen, onToggle }: PodSideBarProps) => {
    const [activeTab, setActiveTab] = useState<"chat" | "files" | "schedule">("chat");
    return (
        <div className="h-full w-full justify-center bg-card/50">
            <div className="p-2 h-full">
                {isOpen ? (
                    <div className="flex flex-col h-full">
                        <div>
                            <div className="flex items-center gap-2 justify-between w-full">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className={`flex flex-1 gap-1 items-center justify-center p-2 ${activeTab == "chat" ? "bg-blue-400" : ""} rounded-md hover:bg-green-400/50 dark:hover:bg-green-400/50 cursor-pointer`}
                                    onClick={() => setActiveTab("chat")}>
                                    <MessageSquare className="h-5 w-5" />
                                    <span>Chat</span>
                                </Button>
                                <Button
                                    className={`flex flex-1 gap-1 items-center justify-center p-2 rounded-md ${activeTab == "schedule" ? "bg-blue-400" : ""} hover:bg-green-400/50 dark:hover:bg-green-400/50 cursor-pointer`}
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setActiveTab("schedule")}>
                                    <Calendar className="h-5 w-5" />
                                    <span>Schedule</span>
                                </Button>
                                <Button
                                    className={`flex flex-1 gap-1 items-center justify-center p-2 rounded-md ${activeTab == "files" ? "bg-blue-400" : ""} hover:bg-green-400/50 dark:hover:bg-green-400/50 cursor-pointer`}
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setActiveTab("files")}>
                                    <FolderOpen className="h-5 w-5" />
                                    <span>Files</span>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="flex flex-1 items-center justify-center rounded-md hover:bg-red-500/80 dark:hover:bg-red-500/80 p-1 cursor-pointer"
                                    onClick={onToggle}>
                                    <X />
                                </Button>
                            </div>
                            <Separator orientation="horizontal" className="my-2" />
                        </div>
                        <div className="flex-1 min-h-0">
                            {activeTab == "chat" &&
                                <PodSidebarChat />
                            }
                            {
                                activeTab == "schedule" &&
                                <PodSidebarSchedule />
                            }
                            {
                                activeTab == "files" &&
                                <PodSidebarFiles />
                            }
                        </div>
                    </div>
                ) :
                    (
                        <div className="flex flex-col space-y-5">
                            <div className="hover:bg-green-400/50 py-3 rounded-lg flex justify-center cursor-pointer" onClick={onToggle}>
                                <MessageSquare className="h-4 w-4" />
                            </div>
                            <div className="hover:bg-green-400/50 py-3 flex justify-center rounded-lg cursor-pointer" onClick={onToggle}>
                                <Calendar className="h-4 w-4" />
                            </div>
                            <div className="hover:bg-green-400/50 py-3 flex justify-center rounded-lg cursor-pointer" onClick={onToggle}>
                                <FolderOpen className="h-4 w-4" />
                            </div>
                        </div>
                    )}
            </div>
        </div>
    );
};