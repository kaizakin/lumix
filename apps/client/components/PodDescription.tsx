"use client"

import { useIsMobile } from "@/hooks/use-mobile"

type podDescriptionProps = {
    podTitle: string;
    podDescription: string;
    activeMembers: number;
}
export const PodDescription = ({ podTitle, podDescription, activeMembers }: podDescriptionProps) => {
    const ismobile = useIsMobile();
    return <div className="bg-gradient-to-r from-primary/10 to-accent/10 px-8 py-2 items-center flex justify-between border-b border-border">
        <div>
            <h1 className="text-xl font-semibold text-balance">{podTitle}</h1>
            <p className="text-sm text-muted-foreground mt-1 text-pretty">{podDescription}</p>
        </div>
        <div className="rounded-2xl bg-green-500/30 px-2 text-white flex text-balance whitespace-nowrap">
            {activeMembers} {ismobile ? "Active" : "Active members"}
        </div>

    </div>
}