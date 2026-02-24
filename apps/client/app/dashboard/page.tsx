"use client";

import { DashboardHeader } from "@/components/DashboardHeader";
import { HoverEffect } from "@/components/ui/card-hover-effect";
import {
  IconBroadcast,
  IconUsersGroup,
  IconPaperclip,
  IconNetwork,
} from "@tabler/icons-react";
import { PodGrid } from "@/components/PodGrid";
import { useEffect, useState } from "react";

type Stats = {
  podsCreated: number;
  podsJoined: number;
  collaborators: number;
  filesShared: number;
};

export default function Home() {
  const [stats, setStats] = useState<Stats>({
    podsCreated: 0,
    podsJoined: 0,
    collaborators: 0,
    filesShared: 0,
  });

  useEffect(() => {
    fetch("/api/stats")
      .then((r) => r.json())
      .then((data: Stats) => setStats(data))
      .catch(console.error);
  }, []);

  const cards = [
    {
      label: "Pods Created",
      value: stats.podsCreated,
      description: "Pods you own and manage",
      icon: IconBroadcast,
      color: "text-teal-400",
    },
    {
      label: "Pods Joined",
      value: stats.podsJoined,
      description: "Pods you collaborate in",
      icon: IconNetwork,
      color: "text-violet-400",
    },
    {
      label: "Collaborators",
      value: stats.collaborators,
      description: "Unique people across your pods",
      icon: IconUsersGroup,
      color: "text-sky-400",
    },
    {
      label: "Files Shared",
      value: stats.filesShared,
      description: "Total files across all pods",
      icon: IconPaperclip,
      color: "text-orange-400",
    },
  ];

  return (
    <div className="mx-4 sm:mx-6 md:mx-10 mb-5">
      <DashboardHeader />
      <HoverEffect items={cards} />
      <PodGrid />
    </div>
  );
}
