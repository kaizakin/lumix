"use client"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ChevronsUpDown, Settings, Bell, LogOut } from "lucide-react"
import { useSidebar } from "./ui/sidebar"
import type { JSX } from "react"
import { signOut } from "next-auth/react"
import { useSession } from "next-auth/react"

export function SidebarProfile(): JSX.Element {
  const { state } = useSidebar();
  const session = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full overflow-hidden justify-center py-1 cursor-pointer focus:outline-none hover:bg-neutral-400/70 mr-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={session.data?.user?.image as string} alt="User avatar" />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
          {state === "expanded" &&
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium">{session.data?.user?.name}</span>
              <span className="text-xs text-muted-foreground">{session.data?.user?.email}</span>
            </div>}
          {state === "expanded" && <ChevronsUpDown />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-max" side="right">
        {/* <DropdownMenuItem className="p-2 flex cursor-pointer">Upgrade to Pro</DropdownMenuItem> */}
        <DropdownMenuItem className="p-2 flex cursor-pointer"><Settings />Account</DropdownMenuItem>
        <DropdownMenuItem className="p-2 flex cursor-pointer" onClick={() => signOut()}><LogOut />Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
