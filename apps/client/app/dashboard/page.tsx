"use client";

import { HoverEffect } from "@/components/ui/card-hover-effect";
import { OnBoarding } from "@/components/OnBoarding";
import VideoPlayer from "@/components/VideoPlayer";
import { Button } from "@/components/ui/button";

export default function Home() {

  return <div>
    <CardHoverEffect />
    <div className="mx-10">
      <div className="h-full w-full sm:grid sm:grid-cols-3 flex flex-col gap-6 mb-10">
        <div className="col-span-1 border-1 bg-card w-full h-full rounded-xl shadow-sm">
          <OnBoarding />
        </div>
        <div className="col-span-2">
        </div>
      </div>
    </div>
  </div>
}



function CardHoverEffect() {
  return (
    <div className="w-full mx-auto px-8">
      <HoverEffect
        items={cards}
        VideoPlayerComponent={VideoPlayer}
        ButtonComponent={Button}
      />
    </div>
  );
}

export const cards = [
  {
    number: 1,
    description: "A Pod, All your ideas and discussions",
    buttonlabel: "Create a Pod",
    path: "/videos/create_pod.mp4"
  },
  {
    number: 2,
    description: "All your deadline Unified into a single place",
    buttonlabel: "Go to Calendar",
    path: "/videos/Calendar.mp4"
  },
  {
    number: 3,
    description: "Access all the shared materials",
    buttonlabel: "Shared materials",
    path: "/videos/Short_Video_of_Shared_Materials.mp4"
  },
  {
    number: 4,
    description: "Invite friends to Lumix and start brainstorming",
    buttonlabel: "Invite friends",
    path: "/videos/Short_Video_of_Invite_Friends.mp4"
  },
];
