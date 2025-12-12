"use client";

import { Canvas } from "@/components/canvas/Canvas";
import { ChatBase } from "@/components/chat/ChatBase";
import { Resizable } from "@/components/Resizable";
import { Tabenum, useTabStore } from "@/store/useTabStore";

function ChatPage(){
    return (
        <div className="flex flex-col h-full bg-background overflow-x-hidden">
            <main className="flex-1 overflow-hidden">
                <ChatBase/>                
            </main>
        </div>
    )
}

const PodPage = () => {
    const tab = useTabStore((s) => s.currentTab);
    if(tab == Tabenum.Storm) return <Resizable/>
    if(tab == Tabenum.Scribble) return <Canvas/>
    if(tab == Tabenum.Text) return <ChatPage/>
}
export default PodPage;