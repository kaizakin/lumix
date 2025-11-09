"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ChevronsUpDown, Settings, Bell, LogOut } from "lucide-react"
import { useSidebar } from "./ui/sidebar"
import type { JSX } from "react"

export function SidebarProfile(): JSX.Element {
  const { state } = useSidebar();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full px-2 overflow-hidden justify-center py-1 cursor-pointer rounded-md focus:outline-none hover:bg-gray-200/40">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://github.com/shadcn.png" alt="User avatar" />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
          {state === "expanded" &&
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">Karthik</span>
              <span className="text-xs text-muted-foreground">Karthik@gmail.com</span>
            </div>}
          {state === "expanded" && <ChevronsUpDown />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-max" side="right">
        {/* <DropdownMenuItem className="p-2 flex cursor-pointer">Upgrade to Pro</DropdownMenuItem> */}
        <DropdownMenuItem className="p-2 flex cursor-pointer"><Settings />Account</DropdownMenuItem>
        <DropdownMenuItem className="p-2 flex cursor-pointer"><Bell />Notifications</DropdownMenuItem>
        <DropdownMenuItem className="p-2 flex cursor-pointer"><LogOut />Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
