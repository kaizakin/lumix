"use client";

import { Home, Podcast } from "lucide-react"
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
} from "@/components/ui/sidebar"
import { useSidebar } from "@/components/ui/sidebar"
import { SidebarProfile } from "./ProfileButton";
import type { JSX } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";


const items = [
    {
        title: "Home",
        url: "/dashboard",
        icon: Home,
    }
]

export function AppSidebar(): JSX.Element {
    const { state } = useSidebar();
    return (
        <>
            <Sidebar variant="floating" collapsible="icon" className="outline-none">
                <SidebarHeader className="p-2 bg-transparent">
                    {state === "expanded" && (
                        <div className="flex items-center gap-3 px-2 py-2 rounded transition-colors hover:bg-teal3/50">
                            <div className="bg-teal2 p-2 w-fit flex-shrink-0">
                                <Image width={20} height={20} className="h-5 w-5 object-cover" src="/lumixlogo.png" alt="Lumix" style={{ filter: 'brightness(0) invert(1)' }} />
                            </div>
                            <div className="flex flex-col min-w-0">
                                <span className={`${asimovian.className} font-bold text-sm text-white leading-none`}>LUMIX</span>
                                <span className="text-(--color-teal2) text-xs font-medium">WORKSPACE</span>
                            </div>
                        </div>
                    )}
                    {state === "collapsed" && (
                        <div className="bg-(--color-teal2) p-2 w-fit mx-auto rounded hover:bg-(--color-teal-light) transition-colors">
                            <Image width={20} height={20} className="h-5 w-5" src="/lumixlogo.png" alt="Lumix" style={{ filter: 'brightness(0) invert(1)' }} />
                        </div>
                    )}
                </SidebarHeader>
                <SidebarContent className="mt-5 w-full">
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild className="hover:bg-neutral-400/70">
                                            <a href={item.url}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuButton className="hover:bg-neutral-400/70"><Podcast size={16} />Pods</SidebarMenuButton>
                            <SidebarMenuSub>
                                <SidebarMenuSubItem className="max-h-60 cursor-pointer overflow-y-auto">
                                    <Pod image="https://media.tenor.com/sUOkoSh_yYAAAAAe/koopa-bah-bah.png" link="#" podName="The Gang"></Pod>
                                    <Pod image="https://media.tenor.com/sUOkoSh_yYAAAAAe/koopa-bah-bah.png" link="#" podName="Idea a projecto"></Pod>
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
    return <div className="flex w-full gap-1 my-2 items-center hover:bg-neutral-400/70">
        <Avatar className="h-8 w-8">
            <AvatarImage src={image} alt="Pod Pic" />
            <AvatarFallback>PC</AvatarFallback>
        </Avatar>
        <a className="truncate w-40" href={link}>{podName}</a>
    </div>
}