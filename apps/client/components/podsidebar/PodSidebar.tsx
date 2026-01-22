"use client";

import { MessageSquare, Calendar, FolderOpen, X } from "lucide-react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { PodSidebarSchedule } from "./PodSidebarSchedule";
import { PodSidebarFiles } from "./PodSidebarFiles";

interface PodSideBarProps {
    isOpen: boolean;
    onToggle: () => void;
}

export const PodSideBar = ({ isOpen, onToggle }: PodSideBarProps) => {
    return (
        <div className="h-full w-full justify-center bg-card/50">
            <div className="p-2 h-full">
                {isOpen ? (
                    <div className="flex flex-col h-full w-full">
                        <div className="flex items-center w-full gap-2">
                            <div className="w-full justify-between gap-2 grid grid-cols-5">
                                <Button
                                    className="col-span-4 flex flex-1 gap-1 items-center justify-center p-2 rounded-md hover:bg-teal-400/50 cursor-pointer"
                                    size="sm"
                                    variant="ghost"
                                >
                                    <FolderOpen className="h-5 w-5" />
                                    <span>Files</span>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="col-span-1 flex flex-1 items-center justify-center rounded-md hover:bg-red-500/80 p-1 cursor-pointer"
                                    onClick={onToggle}>
                                    <X />
                                </Button>
                            </div>
                        </div>
                        <Separator orientation="horizontal" className="my-2" />
                        <div className="flex-1 min-h-0">
                            <PodSidebarFiles />
                        </div>
                    </div>
                ) :
                    (
                        <div className="flex flex-col space-y-5">
                            <div className="hover:bg-green-400/50 py-3 flex justify-center rounded-lg cursor-pointer" onClick={onToggle}>
                                <FolderOpen className="h-4 w-4" />
                            </div>
                        </div>
                    )}
            </div>
        </div>
    );
};