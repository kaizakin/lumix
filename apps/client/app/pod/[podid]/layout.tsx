"use client";

import { useState } from "react";
// import { useParams } from 'next/navigation';
import { BackButton } from "@/components/PodBackButton";
import { Button } from "@/components/ui/button";
import { Check, Copy, Mic, MicOff, Settings, Share2, Video, VideoOff } from "lucide-react";
import { PodDescription } from "@/components/PodDescription";
import { PodSideBar } from "@/components/podsidebar/PodSidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import { SwitchPanes } from "@/components/SwitchPanes";
import { useTabStore } from "@/store/useTabStore";
import { Tabenum } from "@/store/useTabStore";
import { createJoinCode } from "@/actions/CreateJoinCode";
import { useParams } from "next/navigation";
import { Modal } from "@/components/Modal";
import { usePod } from "@/hooks/usePod";

import { PodSettings } from "@/components/PodSettings";
import { PodSocketProvider } from "@/components/providers/PodSocketProvider";

const Layout = ({ children }: { children: React.ReactNode }) => {
    const params = useParams();
    const podId = params.podid as string;
    const tab = useTabStore((s) => s.currentTab);
    const isMobile = useIsMobile();
    const [iscameraOn, setIscamerOn] = useState(false);
    const [isMicOn, setIsMicOn] = useState(false);
    const [isSidebarOpen, setIsSideBarOpen] = useState(false);
    const [code, setCode] = useState("Wait");
    const [shareOpen, setShareOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [copied, setCopied] = useState(false);
    const APP_URL = process.env.NEXT_PUBLIC_APP_URL!
    const { data, isLoading } = usePod(podId);

    const handleCopy = async () => {
        await navigator.clipboard.writeText(APP_URL + "/join/" + code);
        setCopied(true)

        setTimeout(() => {
            setCopied(false)
        }, 1500)
    }

    return <div className="min-h-screen max-h-screen flex flex-col max-w-screen bg-black text-foreground">
        <PodSocketProvider podId={podId}>
            <header className="border-b border-border bg-card/10 backdrop-blur-sm">
                <div className="flex items-center justify-between px-6 py-2">
                    <BackButton />
                    <div className="flex justify-center">
                        <SwitchPanes />
                    </div>
                    <div className="flex items-center space-x-3">
                        <Button
                            variant="outline" size="sm"
                            className="hover:bg-teal-400/50 hover:text-white cursor-pointer"
                            onClick={() => setShareOpen(true)}
                        >
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            className="hover:bg-teal-400/50 hover:text-white cursor-pointer"
                            onClick={() => setSettingsOpen(true)}
                        >
                            <Settings className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </header>

            {tab == Tabenum.Storm &&
                <div className="h-73px">
                    {
                        !isLoading && data && <PodDescription podTitle={data.title} podDescription={data.description as string} activeMembers={data.membercount} />
                    }
                </div>
            }

            <Modal open={shareOpen} onClose={() => setShareOpen(false)} className="w-max p-0 overflow-hidden border border-white/10 bg-[#09090b]">
                <div className="flex h-48 w-full relative">
                    <div className="absolute top-0 left-0 w-1/2 h-full bg-linear-to-b from-teal-900/20 to-transparent pointer-events-none" />

                    <div className="flex-1 flex items-center justify-center p-6 relative">
                        <h2 className="text-xl font-medium text-white tracking-wide text-center">
                            Invite friends to your POD
                        </h2>
                    </div>

                    {/* <div className="w-px bg-white/10 my-8"></div> */}

                    <div className="flex-1  flex flex-col items-center justify-center p-6">
                        {code === "Wait" ? (
                            <Button
                                variant={"ghost"}
                                className="bg-transparent border border-white/20 text-white hover:bg-teal-500/10 hover:text-teal-400 hover:border-teal-500/50 transition-all duration-300"
                                onClick={async () => {
                                    const res = await createJoinCode(podId)
                                    setCode(res.code as string);
                                }}
                            >
                                Create join code
                            </Button>
                        ) : (
                            <div className="flex flex-col items-center gap-1">
                                <span className="text-xs text-gray-400 uppercase tracking-widest">Join Code</span>
                                <div className="group relative flex items-center justify-between rounded-md bg-zinc-900 px-4 py-3 font-mono text-sm text-zinc-100">
                                    <span className="truncate">{APP_URL + "/join/" + code}</span>

                                    <button
                                        onClick={handleCopy}
                                        className="ml-3 text-zinc-400 transition hover:text-zinc-100"
                                        aria-label="Copy invite link"
                                    >
                                        {copied ? (
                                            <Check className="h-4 w-4 text-green-400" />
                                        ) : (
                                            <Copy className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Modal>

            <PodSettings
                open={settingsOpen}
                onClose={() => setSettingsOpen(false)}
                podId={podId}
            />

            <div className="flex-1 flex overflow-hidden min-h-0">
                <div className="flex flex-col w-full min-h-0">
                    {!(isSidebarOpen && isMobile) && (<>
                        <div className="flex-1 transition-all duration-300 ease-in-out min-h-0 overflow-hidden">
                            {children}
                        </div>

                        <div className="border-t border-slate-800 p-2 flex h-73px">
                            <div className="flex items-center justify-end w-full h-full gap-2 ">
                                <Button variant={isMicOn ? "default" : "destructive"}
                                    size={"sm"}
                                    className="cursor-pointer"
                                    onClick={() => setIsMicOn(!isMicOn)}
                                >
                                    {isMicOn ? <Mic /> : <MicOff />}
                                </Button>
                                <Button
                                    variant={iscameraOn ? "default" : "destructive"}
                                    size={"sm"} className="cursor-pointer"
                                    onClick={() => setIscamerOn(!iscameraOn)}
                                >
                                    {iscameraOn ? <Video /> : <VideoOff />}
                                </Button>
                                <Button
                                    variant={"outline"}
                                    className="cursor-pointer"
                                >
                                    <Share2 />Share screen
                                </Button>
                            </div>
                        </div>
                    </>)}
                </div>
                <div className={`${isSidebarOpen ? (isMobile ? "w-full" : "w-80") : "w-12"} border-l border-border transition-all duration-300`}>
                    <PodSideBar isOpen={isSidebarOpen} onToggle={() => setIsSideBarOpen(!isSidebarOpen)} />
                </div>
            </div>
        </PodSocketProvider>
    </div>
}

export default Layout;