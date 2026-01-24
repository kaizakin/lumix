"use client";

import { Modal } from "./Modal";
import { usePod } from "@/hooks/usePod";
import { useState } from "react";
import { Button } from "./ui/button";
import { Trash2, Users, Settings as SettingsIcon, X } from "lucide-react";
import { deletePodAction } from "@/actions/deletePodAction";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface PodSettingsProps {
    open: boolean;
    onClose: () => void;
    podId: string;
}

enum Tab {
    MEMBERS = "members",
    SETTINGS = "settings"
}

export function PodSettings({ open, onClose, podId }: PodSettingsProps) {
    const { data: podData, isLoading } = usePod(podId);
    const [activeTab, setActiveTab] = useState<Tab>(Tab.MEMBERS);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deletePodAction(podId);
            toast.success("Pod deleted successfully");
        } catch (error) {
            toast.error("Failed to delete pod");
            setIsDeleting(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose} className="w-[800px] max-w-[90vw] h-[500px] p-0 bg-[#09090b] text-foreground border border-white/10 overflow-hidden flex">

            {/* Sidebar */}
            <div className="w-1/4 min-w-[200px] border-r border-white/10 bg-black/20 p-4 flex flex-col gap-2">
                <h2 className="text-lg font-semibold px-2 mb-4 text-white">Pod Settings</h2>

                <Button
                    variant={activeTab === Tab.MEMBERS ? "secondary" : "ghost"}
                    className={`w-full justify-start ${activeTab === Tab.MEMBERS ? "bg-teal-500/10 text-teal-400 hover:bg-teal-500/20" : "hover:bg-white/5"}`}
                    onClick={() => setActiveTab(Tab.MEMBERS)}
                >
                    <Users className="mr-2 h-4 w-4" />
                    Members
                </Button>

                <Button
                    variant={activeTab === Tab.SETTINGS ? "secondary" : "ghost"}
                    className={`w-full justify-start ${activeTab === Tab.SETTINGS ? "bg-teal-500/10 text-teal-400 hover:bg-teal-500/20" : "hover:bg-white/5"}`}
                    onClick={() => setActiveTab(Tab.SETTINGS)}
                >
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    Settings
                </Button>
            </div>

            <div className="flex-1 flex flex-col h-full bg-gradient-to-br from-zinc-900/50 to-black/50">
                <div className="flex justify-between items-center p-6 border-b border-white/5">
                    <h3 className="text-xl font-medium text-white">
                        {activeTab === Tab.MEMBERS ? "Members" : "General Settings"}
                    </h3>
                    <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full hover:bg-white/10">
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex-1 p-6 overflow-y-auto">
                    <AnimatePresence mode="wait">
                        {activeTab === Tab.MEMBERS ? (
                            <motion.div
                                key="members"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-4"
                            >
                                {isLoading ? (
                                    <div className="text-muted-foreground">Loading members...</div>
                                ) : (
                                    <div className="grid gap-4">
                                        {podData?.members?.map((member: any) => (
                                            <div key={member.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                                                    {member.image ? (
                                                        <img src={member.image} alt={member.name || "User"} className="h-full w-full rounded-full object-cover" />
                                                    ) : (
                                                        (member.email?.[0] || member.name?.[0] || "U").toUpperCase()
                                                    )}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-white font-medium">{member.name || "User"}</span>
                                                    <span className="text-xs text-muted-foreground">{member.email}</span>
                                                </div>
                                            </div>
                                        ))}
                                        {(!podData?.members || podData.members.length === 0) && (
                                            <div className="text-muted-foreground text-center py-10">No members found.</div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="settings"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                                className="space-y-6"
                            >
                                <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-6 space-y-4">
                                    <div className="flex items-center gap-2 text-red-400">
                                        <Trash2 className="h-5 w-5" />
                                        <h4 className="font-semibold text-lg">Delete Pod</h4>
                                    </div>
                                    <p className="text-sm text-zinc-400">
                                        Permanently delete this pod and all its contents. This action cannot be undone.
                                        All messages, files, and member associations will be removed.
                                    </p>
                                    <div className="flex justify-end pt-2">
                                        <Button
                                            variant="destructive"
                                            onClick={handleDelete}
                                            disabled={isDeleting}
                                            className="bg-red-500/80 hover:bg-red-600 text-white"
                                        >
                                            {isDeleting ? "Deleting..." : "Delete Pod"}
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </Modal>
    );
}
