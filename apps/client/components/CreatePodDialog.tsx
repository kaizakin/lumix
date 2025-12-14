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
import { useState } from "react"
import { toast } from "sonner"

export function CreatePodDialog() {
    const [title, setTitle] = useState("My Pod");
    const [isCreating, setIsCreating] = useState(false);
    const [description, setDescription] = useState("Project idea discussion");

    async function handleSubmit() {
        if (isCreating) return;

        setIsCreating(true);

        try {
            const roomTitle = title.trim();
            const roomDescription = description.trim();

            const res = await fetch(`/api/pod`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ title: roomTitle, description: roomDescription })
            })

            const data = await res.json();

            if (!res.ok) {
                toast.error("Error", {
                    description: data.error || "Failed to create pod please try again"
                })
            }

            console.log(data)

            if (data) {
                toast.success("Room created!", {
                    description: `Room "${roomTitle}" has been created successfully.`
                })
            }

        } catch (error) {
            console.error('Error creating room:', error);
        } finally {
            setIsCreating(false);
        }
    }
    return (
        <Dialog>
            <form>
                <DialogTrigger asChild>
                    <Button variant="outline">Create Pod</Button>
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
