"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

export function CreatePodDialog() {
    const [title, setTitle] = useState("My Pod");
    const [isCreating, setIsCreating] = useState(false);
    const [description, setDescription] = useState("Project idea discussion");
    const [open, setOpen] = useState(false);

    async function handleSubmit() {
        if (isCreating) return;

        setIsCreating(true);

        try {
            const roomTitle = title.trim();
            const roomDescription = description.trim();

            const promise = fetch(`/api/pod`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: roomTitle, description: roomDescription })
            }).then(async (res) => {
                const data = await res.json();

                if (!res.ok) {
                    throw new Error(data.error || "Failed to create pod please try again"); // throw error and it's cathed by toast.promise
                }

                console.log(data);
                return data;
            })

            toast.promise(promise,// toast.promise is  non blocking it sets up and the success runs after the promise resolves asynchronously
                {
                    loading: "Creating room",
                    success: () => `${roomTitle} has been created`,// it's asynchronous
                    error: (error) => error.message || "Error",
                    action: {
                        label: "Close",
                        onClick: () => { },
                    },
                }
            )

            await promise; // wait for the promise to resovle before closing.
            setOpen(false);

        } catch (error) {
            console.error('Error creating room:', error);
        } finally {
            setIsCreating(false);
        }
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <form>
                <DialogTrigger asChild>
                    <Button className="bg-light1 hover:scale-105 transition-all cursor-pointer">
                        <Plus className="w-4 h-4 mr-2" />
                        Create Pod
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Create Pod</DialogTitle>
                        <DialogDescription>
                            Give a name and a concise description describing the motive of you&apos;re pod
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-3">
                            <Label htmlFor="name-1">Name</Label>
                            <Input id="name-1" name="name" value={title} onChange={(e) => setTitle(e.target.value)} />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="username-1">Username</Label>
                            <Input id="username-1" name="username" value={description} onChange={(e) => setDescription(e.target.value)} />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" onClick={handleSubmit}>Proceed</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}
