"use client";

import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { MoreVertical, Users, Search, Inbox } from "lucide-react"
import { Card, CardContent } from "./ui/card"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation"
import { Input } from "./ui/input"



type getPodsResponse = {
    id: string;
    userId: string;
    title: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
}

export function PodGrid() {
    const [view, setView] = useState<"grid" | "list">("grid");
    const [podData, setPodData] = useState<getPodsResponse[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [searchFocused, setSearchFocused] = useState(false);
    const router = useRouter();

    async function fetchPods() {
        setLoading(true);
        const res = await fetch("/api/getpods");

        if (!res.ok) {
            console.error("request failed:", res.status);
            setLoading(false);
            return;
        }

        const data: { podData: getPodsResponse[] } = await res.json();
        setPodData(data.podData);
        setLoading(false);

        console.log(data);
    }

    function timeAgo(timestamp: string) {

        const formatted = formatDistanceToNow(new Date(timestamp), {
            addSuffix: true,
        });

        console.log("formatted", formatted);
        return formatted;
    }


    useEffect(() => {
        fetchPods();
    }, [])

    const updatedPodData = podData.map((pod) => ({
        ...pod,
        activeNow: 4,
        lastActive: timeAgo(pod.updatedAt.toString()),
        members: 6
    }))

    const filteredPods = updatedPodData.filter(pod => 
        pod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pod.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <h2 className="text-2xl font-bold">Your Pods</h2>
                        <div className="flex bg-muted p-1 focus:outline-none">
                            <Button
                                variant={view === "grid" ? "secondary" : "ghost"}
                                size="sm"
                                className={`h-7 ${view === "grid" && "bg-teal2"} hover:bg-slate-400 text-xs`}
                                onClick={() => setView("grid")}
                            >
                                Grid
                            </Button>
                            <Button
                                variant={view === "list" ? "secondary" : "ghost"}
                                size="sm"
                                className={`h-7 text-xs ${view === "list" && "bg-teal2"} hover:bg-slate-400`}
                                onClick={() => setView("list")}
                            >
                                List
                            </Button>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10">
                            Created
                        </Button>
                        <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10">
                            Joined
                        </Button>
                    </div>
                </div>

                {podData.length > 0 && (
                    <div className={`relative transition-all duration-300 ease-out ${searchFocused ? 'scale-y-100' : 'scale-y-95 origin-top'}`}>
                        <Search className="absolute left-3 h-4 w-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <Input 
                            placeholder="Search pods..." 
                            className="pl-9 w-full rounded-none" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                        />
                    </div>
                )}
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <p className="text-muted-foreground">Loading pods...</p>
                </div>
            ) : podData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Inbox className="h-12 w-12 text-muted-foreground/50 mb-3" />
                    <h3 className="text-lg font-semibold text-foreground mb-1">No Pods Created</h3>
                    <p className="text-sm text-muted-foreground mb-4">Get started by creating your first pod for collaborative brainstorming</p>
                </div>
            ) : filteredPods.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Search className="h-12 w-12 text-muted-foreground/50 mb-3" />
                    <h3 className="text-lg font-semibold text-foreground mb-1">No Pods Found</h3>
                    <p className="text-sm text-muted-foreground">Try adjusting your search query</p>
                </div>
            ) : view === "grid" ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredPods.map((pod, index) => (
                        <Card
                            key={pod.id}
                            className="group relative rounded-none overflow-hidden border-border bg-card transition-all hover:border-primary hover:shadow-lg hover:shadow-primary/10 cursor-pointer animate-in fade-in slide-in-from-bottom-4"
                            style={{
                                animationDelay: `${index * 50}ms`,
                                animationFillMode: "backwards",
                            }}
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br from-dark2 to-dark3 opacity-50`} />
                            <CardContent className="relative p-6 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-lg text-balance">{pod.title}</h3>
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                                            <span>Edited {pod.lastActive}</span>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="flex items-center gap-2">
                                    <div className="flex -space-x-2">
                                        {Array.from({ length: Math.min(pod.activeNow, 3) }).map((_, i) => (
                                            <Avatar key={i} className="h-8 w-8 border-2 border-card">
                                                <AvatarFallback className="bg-primary text-primary-foreground text-[10px]">
                                                    {String.fromCharCode(65 + i)}
                                                </AvatarFallback>
                                            </Avatar>
                                        ))}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                        <span className="font-medium text-foreground">{pod.activeNow} present</span>
                                    </div>
                                    {pod.activeNow > 0 && (
                                        <Badge className="ml-auto bg-emerald-500/20 text-emerald-400 border-emerald-500/30 animate-pulse text-[10px] h-5">
                                            LIVE
                                        </Badge>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                        <Users className="h-3.5 w-3.5" />
                                        <span>{pod.members}</span>
                                    </div>
                                    <Button
                                        size="sm"
                                        onClick={() => router.push(`/pod/${pod.id}`)}
                                        className="ml-auto bg-primary text-primary-foreground hover:bg-primary/90 transition-all text-xs h-8 px-3"
                                    >
                                        Open Pod
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="border-border bg-dark2 rounded-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-muted/50 text-muted-foreground uppercase text-[10px] font-bold tracking-wider">
                                <tr>
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3">Owner</th>
                                    <th className="px-6 py-3">Last Active</th>
                                    <th className="px-6 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/50">
                                {filteredPods.map((pod) => (
                                    <tr key={pod.id} className="hover:bg-muted/30 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <span className="font-medium">{pod.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">{pod.userId}</td>
                                        <td className="px-6 py-4 text-muted-foreground">{pod.lastActive}</td>
                                        <td className="px-6 py-4 text-right">
                                            <Button onClick={() => router.push(`/pod/${pod.id}`)} variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                                                Open
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

        </div>

    )

}

