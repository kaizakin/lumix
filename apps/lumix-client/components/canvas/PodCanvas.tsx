"use client"

import { Maximize2, Minimize2, PresentationIcon, TvMinimalPlayIcon } from "lucide-react"
import { Switch } from "../ui/switch"
import { Button } from "../ui/button"
import { useState } from "react"
import { PodCreateCanvasmsg } from "./PodCreateCanvasmsg"
import { CanvasWrapper } from "./CanvasWrapper"

export const PodCanvas = ()=>{
    const [isCanvasFullscreen, setIsCanvasFullscreen] = useState(false);
    const [isCanvasCreated, setIsCanvasCreated] = useState(false);
    return <div className="h-full w-full relative">
        <div className="absolute inset-4 bg-card/10 border border-border rounded-lg shadow-sm overflow-hidden">
           <div className="flex items-center justify-between p-3 border-b border-border bg-muted/50">
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5"><div className="bg-blue-500 p-1.5 rounded-md"><PresentationIcon className="h-4 w-4"/></div>Present</span>
                    <Switch/>
                    <span className="flex items-center gap-1.5"><div className="bg-blue-500 p-1.5 rounded-md"><TvMinimalPlayIcon className="h-4 w-4"/></div>Observe</span>
                </div>
                <Button variant="ghost" size="sm" className="border border-border hover:bg-green-400/50 dark:hover:bg-green-400/50 cursor-pointer" onClick={() => setIsCanvasFullscreen(!isCanvasFullscreen)}>
                  {isCanvasFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </Button>
            </div> 
            {
                isCanvasCreated ? <CanvasWrapper/> : <PodCreateCanvasmsg createCanvas={setIsCanvasCreated}/>
            }
        </div>
    </div>
}