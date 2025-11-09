"use client";

import { Button } from "@/components/ui/button"
import discord from "@/public/discord.svg"
import Image from "next/image"
import { useSidebar } from "@/components/ui/sidebar";
import { JSX } from "react";

export function JoinDiscordButton() :JSX.Element {
  const { state } = useSidebar();
  return (
    <Button
      className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-3xl cursor-pointer flex items-center justify-center gap-2 shadow-md hover:shadow-indigo-500/50 transition-shadow duration-300"
      onClick={() => window.open('#', '_blank')}
    >
      <Image src={discord} alt="discord" height={15} width={15} />
      {state === "expanded" &&
        <span className="text-xs text-white">Join the Community</span>
      }
    </Button>
  )
}
