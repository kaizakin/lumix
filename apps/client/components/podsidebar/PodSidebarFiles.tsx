"use client"

import { Download, FileText, Upload } from "lucide-react"
import { Button } from "../ui/button"
import { ScrollArea } from "../ui/scroll-area"
import { Card } from "../ui/card"
import { useState } from "react"
import { useParams } from "next/navigation"
import { downloadFileAction, uploadFileAction } from "@/actions/filesAction"
import { getFilesAction } from "@/actions/getFilesAction"
import { toast } from "sonner"
import { useQuery, useQueryClient } from "@tanstack/react-query"

export const PodSidebarFiles = () => {
    const params = useParams();
    const podId = params.podid;
    const [isHovered, setIsHovered] = useState<string | null>(null);
    const queryClient = useQueryClient()

    const MAXFILESIZE = 5 * 1024 * 1024;

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (file.size > MAXFILESIZE) {
            toast("Please upload file less that 5MB")
            return;
        }

        const fd = new FormData()
        fd.append("file", file);
        fd.append("pod", params.podid as string)

        const promise = uploadFileAction(fd).then((res) => {
            queryClient.invalidateQueries({
                queryKey: ["podFiles", podId]
            })
            if (res.success) return res;
            throw new Error(res.message);

        });

        toast.promise(promise,
            {
                loading: "Uploading file...",
                success: () => `${file.name} uploaded successfully`,
                error: (error) => error.message || "Error uploading file",
                action: {
                    label: "Close",
                    onClick: () => { },
                },
            }
        )
    }

    const { data: files, isLoading } = useQuery({
        queryKey: ["podFiles", podId],
        queryFn: async () => {
            const res = await getFilesAction(podId as string);
            if (!res.success) {
                throw new Error(res.error);
            }
            return res.data;
        }
    })

    async function Downloadbutton(fileid: string, fileName: string) {
        const url = await downloadFileAction(fileid, podId as string)
        if (!url) return
        const a = document.createElement("a")
        a.href = url
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
    }

    return <div className="h-full flex flex-col">
        <div className="flex justify-between items-center p-2">
            <h1 className="font-medium">
                Shared files
            </h1>
            <Button asChild
                className="space-x-2 flex items-center cursor-pointer hover:bg-teal-400/50"
                variant="outline"
            >
                <label htmlFor="file-upload">
                    <Upload />
                    <span className="text-sm">Upload</span>
                </label>
            </Button>
            <input
                id="file-upload"
                type="file"
                className="hidden"
                onChange={handleUpload}
            />
        </div>
        <ScrollArea className="scrollbar-custom-thin h-full overflow-auto flex-1 mt-3">
            <div className="p-1">
                {isLoading ? <div className="flex justify-center items-center">loading...</div>
                    :
                    files && files.length > 0 ?
                        files.map(file => (
                            <Card key={file.id} className={`relative my-4 p-3 justify-between mx-2 ${isHovered == file.id ? "bg-gradient-to-l from-blue-400 to-transparent" : ""}`}>
                                <div className="flex space-x-2">
                                    <div className="rounded flex items-center justify-center bg-blue-400/60 p-2">
                                        <FileText className="text-primary w-4 h-4" />
                                    </div>
                                    <div className="flex flex-col">
                                        <h2 className="font-semibold text-foreground">{file.fileName}</h2>
                                        <div className="text-xs text-muted-foreground">
                                            <span>{file.fileSize}</span>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        className="right-1 absolute cursor-pointer hover:bg-transparent opacity-0 hover:opacity-100 transition-all ease-in-out duration-200"
                                        size="sm"
                                        onMouseEnter={() => setIsHovered(file.id)}
                                        onMouseLeave={() => setIsHovered(null)}
                                        onClick={() => Downloadbutton(file.id, file.fileName)}
                                    >
                                        <Download />
                                    </Button>
                                </div>
                            </Card>
                        )) : (
                            <div className="flex flex-col items-center justify-center p-8 text-muted-foreground opacity-50">
                                <FileText className="w-12 h-12 mb-2" />
                                <span className="text-sm">No files uploaded yet</span>
                            </div>
                        )}
            </div>
        </ScrollArea>
    </div>
}