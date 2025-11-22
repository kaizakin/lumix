"use client";

import { Canvas } from "@/components/canvas/Canvas";
import { Resizable } from "@/components/Resizable";
import { Tabenum, useTabStore } from "@/store/useTabStore";

const PodPage = () => {
    const tab = useTabStore((s) => s.currentTab);
    if(tab == Tabenum.Home) return <Resizable/>
    if(tab == Tabenum.Canvas) return <Canvas/>
}
export default PodPage;