import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"

export function Resizable() {
    return (
        <ResizablePanelGroup
            direction="horizontal"
            className="h-full w-full rounded-lg border"
        >
            <ResizablePanel defaultSize={50}>
                <div className="flex h-full w-full bg-amber-300 items-center justify-center p-6">
                    <span className="font-semibold">One</span>
                </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={50}>
                <div className="flex bg-amber-400 h-full w-full items-center justify-center p-6">
                    <span className="font-semibold">Two</span>
                </div>
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}
