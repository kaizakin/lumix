"use client";

import { DashboardHeader } from "@/components/DashboardHeader";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { IconBroadcast, IconCalendarDue, IconFileCheck, IconFileSad } from "@tabler/icons-react";
import { PodGrid } from "@/components/PodGrid";

export default function Home() {
  return <div className="mx-4 sm:mx-6 md:mx-10 mb-5">
    <DashboardHeader />
    <HoverEffect items={cards} />
    <PodGrid />
  </div>
}

const cards = [
  {
    label: "Pending deadlines",
    value: 12,
    description: "+3 this week",
    icon: IconCalendarDue,
    color: "text-red-500",
  },
  {
    label: "Pods",
    value: 48,
    description: "Total Active pods",
    icon: IconBroadcast,
    color: "text-teal-400",
  },
  {
    label: "Issues",
    value: 7,
    description: "Active issues",
    icon: IconFileSad,
    color: "text-orange-400",
  },
  {
    label: "Completion rate",
    value: 24,
    description: "Total issues / completed issues",
    icon: IconFileCheck,
    color: "text-emerald-400",
  }
]
