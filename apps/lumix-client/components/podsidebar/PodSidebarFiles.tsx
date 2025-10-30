import { Download, FileText, Upload } from "lucide-react"
import { Button } from "../ui/button"
import { ScrollArea } from "../ui/scroll-area"
import { Card } from "../ui/card"
import { useState } from "react"

export const PodSidebarFiles = () => {
    const [isHovered, setIsHovered] = useState<string | null>(null);
    const [sharedFiles, setSharedFiles] = useState([
        {
            id: "1",
            name: "Project_Wireframes.fig",
            size: "2.6 MB",
            uploaded: "2 hours ago"
        },
        {
            id: "2",
            name: "User_Research_Data.pdf",
            size: "2 MB",
            uploaded: "2 days ago"
        },
        {
            id: "3",
            name: "brand_assets.zip",
            size: "45 mb",
            uploaded: "3 days ago"
        },
        {
            id: "4",
            name: "brand_assets.zip",
            size: "45 mb",
            uploaded: "3 days ago"
        },
        {
            id: "5",
            name: "brand_assets.zip",
            size: "45 mb",
            uploaded: "3 days ago"
        },
        {
            id: "6",
            name: "brand_assets.zip",
            size: "45 mb",
            uploaded: "3 days ago"
        },
        {
            id: "7",
            name: "brand_assets.zip",
            size: "45 mb",
            uploaded: "3 days ago"
        },
        {
            id: "8",
            name: "brand_assets.zip",
            size: "45 mb",
            uploaded: "3 days ago"
        },
        {
            id: "9",
            name: "brand_assets.zip",
            size: "45 mb",
            uploaded: "3 days ago"
        },
        {
            id: "10",
            name: "brand_assets.zip",
            size: "45 mb",
            uploaded: "3 days ago"
        },
    ])
    return <div className="h-full flex flex-col">
        <div className="flex justify-between items-center p-2">
            <h1 className="font-medium">
                Shared files
            </h1>
            <Button
                className="space-x-2 flex items-center cursor-pointer hover:bg-green-400/50 dark:hover:bg-green-400/50"
                variant="outline"
            >
                <Upload />
                <span className="text-sm">Upload</span>
            </Button>
        </div>
        <ScrollArea className="scrollbar-custom-thin h-full overflow-auto flex-1 mt-3">
            <div className="p-1">
                {sharedFiles.map(file => (
                    <Card key={file.id} className={`relative my-4 p-3 justify-between mx-2 ${isHovered == file.id ? "bg-gradient-to-l from-blue-100 dark:from-blue-400 to-transparent dark:to-transparent":""}`}>
                        <div className="flex space-x-2">
                            <div className="rounded flex items-center justify-center bg-blue-400/60 p-2">
                                <FileText className="text-primary w-4 h-4" />
                            </div>
                            <div className="flex flex-col">
                                <h2 className="font-semibold text-foreground">{file.name}</h2>
                                <div className="text-xs text-muted-foreground">
                                    <span>{file.size}</span> • <span>{file.uploaded}</span>
                                </div>
                            </div>
                            <Button 
                            variant="ghost" 
                            className="right-1 absolute cursor-pointer hover:bg-transparent dark:hover:bg-transparent opacity-0 hover:opacity-100 transition-all ease-in-out duration-200" 
                            size="sm"
                            onMouseEnter={()=>setIsHovered(file.id)}
                            onMouseLeave={()=>setIsHovered(null)}
                            >
                                <Download />
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </ScrollArea>
    </div>
}
