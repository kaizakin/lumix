import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { MarkdownEditor } from "./MarkdownEditor"
import { PodVideoPage } from "./video/PodVideoPage"

export function Resizable() {
    return (
        <ResizablePanelGroup
            direction="horizontal"
            className="h-full w-full border-none"
        >
            <ResizablePanel defaultSize={50} className="min-h-0 overflow-hidden">
                <div className="h-full w-full overflow-auto p-3 scrollbar-custom-thin font-serif">
                    <MarkdownEditor />
                </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50} className="min-h-0 overflow-hidden">
                <div className="flex h-full w-full items-center justify-center p-6">
                    <PodVideoPage/>
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}
