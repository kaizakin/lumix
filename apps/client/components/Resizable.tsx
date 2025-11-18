import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { MarkdownEditor } from "./MarkdownEditor"

export function Resizable() {
    return (
        <ResizablePanelGroup
            direction="horizontal"
            className="h-full w-full rounded-md border"
        >
            <ResizablePanel defaultSize={50} className="min-h-0 overflow-hidden">
                <div className="h-full w-full overflow-hidden">
                    <MarkdownEditor />
                </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50} className="min-h-0 overflow-hidden">
                <div className="flex h-full w-full items-center justify-center p-6">
                    <span className="font-semibold">Two</span>
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}
