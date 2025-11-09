"use client";

import { BookOpen, ChevronDown, Home, Podcast } from "lucide-react"
import Image from "next/image"
import { asimovian } from "@/style/font"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarTrigger,
    SidebarFooter,
    SidebarMenuSub,
    SidebarMenuSubItem,
    SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { useSidebar } from "@/components/ui/sidebar"
import { SidebarProfile } from "./ProfileButton";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { useState } from "react";
import type { JSX } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { JoinDiscordButton } from "./JoinDiscord";


const items = [
    {
        title: "Home",
        url: "#",
        icon: Home,
    }
]

export function AppSidebar(): JSX.Element {
    const { state } = useSidebar();
    const [open, setOpen] = useState(false);
    return (
        <>
            <Sidebar variant="floating" collapsible="icon" className="outline-none">
                <SidebarHeader>
                    <div className="flex gap-3">
                        <Image width={7} height={7} className="h-7 w-7" src="/lumixlogo.png" alt="Lumix" />
                        {state === "expanded" && <span className={`${asimovian.className} font-bold text-xl`}>Lumix</span>}
                    </div>
                </SidebarHeader>
                <SidebarContent className="mt-5 w-full">
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <a href={item.url}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                            <SidebarMenu>
                                <Collapsible defaultOpen className="group/collapsible" onOpenChange={setOpen} open={open}>
                                    <SidebarMenuItem>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton asChild>
                                                <div className="flex justify-between">

                                                    <a href="#" className="flex gap-2 items-center"><BookOpen size={16} />Introduction</a>
                                                    <ChevronDown className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
                                                </div>
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                <SidebarMenuButton>
                                                    <a href="#">Get Started</a>
                                                </SidebarMenuButton>
                                            </SidebarMenuSub>
                                            <SidebarMenuSub>
                                                <SidebarMenuButton>
                                                    <a href="#">Tutorial</a>
                                                </SidebarMenuButton>
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </SidebarMenuItem>
                                </Collapsible>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarMenu className="mt-4">
                        <SidebarGroup>
                            <SidebarGroupLabel className="text-xs">
                                Got a suggestion? Need help?
                            </SidebarGroupLabel>
                        </SidebarGroup>
                        <SidebarMenuItem>
                            <div className="flex justify-center">
                                <JoinDiscordButton />
                            </div>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuButton><Podcast size={16} />Pods</SidebarMenuButton>
                            <SidebarMenuSub>
                                <SidebarMenuSubItem className="max-h-60 cursor-pointer overflow-y-auto">
                                    <Pod image="https://media.tenor.com/sUOkoSh_yYAAAAAe/koopa-bah-bah.png" link="#" podName="The Gang"></Pod>
                                    <Pod image="https://media.tenor.com/sUOkoSh_yYAAAAAe/koopa-bah-bah.png" link="#" podName="Idea a projecto"></Pod>
                                    <Pod image="https://media.tenor.com/sUOkoSh_yYAAAAAe/koopa-bah-bah.png" link="#" podName="Ini illaya"></Pod>
                                    <Pod image="https://media.tenor.com/sUOkoSh_yYAAAAAe/koopa-bah-bah.png" link="#" podName="Hip Hop Adhi"></Pod>
                                    <Pod image="https://media.tenor.com/sUOkoSh_yYAAAAAe/koopa-bah-bah.png" link="#" podName="TVK FTW"></Pod>
                                    <Pod image="https://media.tenor.com/sUOkoSh_yYAAAAAe/koopa-bah-bah.png" link="#" podName="bah bah black sheep"></Pod>
                                    <Pod image="https://media.tenor.com/sUOkoSh_yYAAAAAe/koopa-bah-bah.png" link="#" podName="The Gang"></Pod>
                                    <Pod image="https://media.tenor.com/sUOkoSh_yYAAAAAe/koopa-bah-bah.png" link="#" podName="The Gang"></Pod>
                                </SidebarMenuSubItem>
                            </SidebarMenuSub>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarFooter>
                    <SidebarProfile />
                </SidebarFooter>
            </Sidebar>
            <SidebarTrigger className="w-7 h-7 mt-4 cursor-pointer" />
        </>)

}

type podProps = {
    image: string;
    podName: string;
    link: string;
}

function Pod({ image, podName, link }: podProps) {
    return <div className="flex w-full rounded-md gap-1 my-2 items-center hover:bg-gray-200/30">
        <Avatar className="h-8 w-8">
            <AvatarImage src={image} alt="Pod Pic" />
            <AvatarFallback>PC</AvatarFallback>
        </Avatar>
        <a className="truncate w-40" href={link}>{podName}</a>
    </div>
}