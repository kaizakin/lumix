"use client";

import { Canvas } from "@/components/canvas/Canvas";
import { Resizable } from "@/components/Resizable";
import { Tabenum, useTabStore } from "@/store/useTabStore";

const PodPage = () => {
    const tab = useTabStore((s) => s.currentTab);
    if(tab == Tabenum.Storm) return <Resizable/>
    if(tab == Tabenum.Scribble) return <Canvas/>
}
export default PodPage;