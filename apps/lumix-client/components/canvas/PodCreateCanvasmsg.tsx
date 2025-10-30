import { Palette, Plus } from "lucide-react"
import { Button } from "../ui/button"

export const PodCreateCanvasmsg = ({ createCanvas }: { createCanvas: (bool: boolean) => void }) => {
    return <div className="bg-gradient-to-br from-background to-muted/60 flex h-full justify-center items-center w-full">
        <div className="text-center flex flex-col justify-center items-center space-y-4 p-8">
            <div className="rounded-full bg-blue-500 p-4 dark:bg-blue-500/80">
                <Palette />
            </div>
            <h1 className="text-foreground">Interactive whiteboard</h1>
            <h2 className="text-muted-foreground">Start drawing, adding sticky tasks, or uploading images to begin collaborating</h2>
            <Button
                variant="default"
                className="bg-blue-500 hover:bg-blue-500/80 cursor-pointer"
                onClick={() => createCanvas(true)}
                >
                <Plus />Start Creating
            </Button>
        </div>
    </div>
}