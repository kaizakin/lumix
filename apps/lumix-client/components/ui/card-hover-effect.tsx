import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { Card, CardDescription } from "./card";
import type { Button } from "./button";

import React, { useState } from "react";

export const HoverEffect = ({
  items,
  className,
  VideoPlayerComponent,
  ButtonComponent,
}: {
  items: {
    number: number;
    description: string;
    buttonlabel: string;
    path: string;
  }[];
  className?: string;
  VideoPlayerComponent?: React.ComponentType<{ path: string }>;
  ButtonComponent?: React.ComponentType<React.ComponentProps<typeof Button>>;
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 py-2",
        className
      )}
    >
      {items.map((item, idx) => (
        <a
          key={item?.number}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-neutral-200 shadow-md dark:bg-slate-800/[0.8] block rounded-3xl pointer-events-none z-0"
                layoutId="hoverBackground"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: 1,
                  transition: { duration: 0.15 },
                }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.15, delay: 0.2 },
                }}
              />
            )}
          </AnimatePresence>
          <Card className="relative z-10 shadow-[1px_1px_3px_1px_rgba(0,0,0,0.1)] p-3 dark:border dark:border-white/20 rounded-2xl">
            {VideoPlayerComponent && <VideoPlayerComponent path={item.path} />}
            <CardDescription className="font-sans">{item.description}</CardDescription>
            {ButtonComponent ? (
              <ButtonComponent
                variant="outline"
                className="cursor-pointer font-mono bg-black text-white  hover:bg-black/70 hover:text-white dark:bg-white dark:text-black dark:hover:text-black dark:hover:bg-gray-50 px-10"
              >
                {item.buttonlabel}
              </ButtonComponent>
            ) : (
              <div className="cursor-pointer font-mono bg-black text-white  hover:bg-black/70 hover:text-white dark:bg-white dark:text-black dark:hover:text-black dark:hover:bg-gray-50 px-10 py-2 rounded text-center">
                {item.buttonlabel}
              </div>
            )}
          </Card>
        </a>
      ))}
    </div>
  );
};
