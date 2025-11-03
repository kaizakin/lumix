"use client";

import { JSX, useState } from "react";
import { Progress } from "@/components/ui/progress"
import { IconBox, IconBrain, IconBrandDiscord, IconCircleCheck, IconCircleDashed, IconCircles, IconFriends } from '@tabler/icons-react';

export const OnBoarding = () : JSX.Element => {
    const [progress, setProgress] = useState<number>(10);
    const items = [{
        text: "Create a pod",
        buttonText: "create a pod",
        order: "1/5",
        svg: <IconBox />
    }, {
        text: "Invite friends",
        buttonText: "Invite",
        order: "2/5",
        svg: <IconFriends />
    }, {
        text: "Assign roles",
        buttonText: "Assign roles",
        order: "3/5",
        svg: <IconCircles />
    }, {
        text: "Start brainstorming",
        buttonText: "start brainstorming",
        order: "4/5",
        svg: <IconBrain />
    }, {
        text: "Join our Discord",
        buttonText: "Join discord",
        order: "5/5",
        svg: <IconBrandDiscord />
    }
    ]
    return <div className="p-5 w-full h-full space-y-2">
        <p className="text-md font-bold text-white">Get your Brain cells work with Lumix</p>
        <div className="sm:flex w-full h-full gap-2 items-center flex flex-col">
            <div className="w-full flex flex-col mt-5 h-full justify-between">
                <div className="w-full flex gap-5 items-center">
                    <Progress value={progress} />
                    <h1 className="text-muted-foreground text-sm">{progress}%</h1>
                </div>
                <div className="pt-5 flex-1 h-full flex justify-between flex-col">
                    {items.map((i, idx) => (
                        <Items key={idx} text={i.text} buttonText={i.buttonText} order={i.order} svg={i.svg}></Items>
                    ))}
                </div>
            </div>
        </div>
    </div>
}

type ItemsProps = {
    text: string;
    buttonText: string;
    order: string;
    svg: React.ReactNode
}

function Items({ text, buttonText, order, svg }: ItemsProps) {
    const [done, setDone] = useState(true);
    return <div className="p-3 items-center space-y-1 justify-start w-full flex-1">
        <div className="flex justify-between">
            <div className="flex gap-1 sm:gap-2">
                {done ? <IconCircleCheck /> : <IconCircleDashed />}
                <h1 className="text-md font-sm">{text}</h1>
            </div>
            <p>{order}</p>
        </div>
        <BorderButton svg={svg}>{buttonText}</BorderButton>
    </div>
}

function BorderButton({ children, svg }: { children: React.ReactNode, svg: React.ReactNode }) {
    return <div className="border-1 border-green-500/80 p-1 w-50 gap-2 flex rounded-sm items-center sm:mt-3 text-green-500/80">
        {svg}
        {children}
    </div>
}