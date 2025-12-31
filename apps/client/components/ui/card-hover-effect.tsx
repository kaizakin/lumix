import { cn } from "@/lib/utils";
import { Icon, IconProps } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";

import { ForwardRefExoticComponent, RefAttributes, useEffect, useState } from "react";

export const HoverEffect = ({
  items,
  className,
}: {
  items: {
    label: string;
    value: number;
    description: string;
    icon: ForwardRefExoticComponent<IconProps & RefAttributes<Icon>>;
    color: string;

  }[];
  className?: string;
}) => {
  let [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 py-10",
        className
      )}
    >
      {items.map((item, idx) => (
        <a
          key={item?.label}
          className="relative group block p-2 h-full w-full"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <AnimatePresence>
            {hoveredIndex === idx && (
              <motion.span
                className="absolute inset-0 h-full w-full bg-teal-900 block rounded-sm"
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
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-1">
                <p className="text-sm text-light1">{item.label}</p>
                <p className="text-2xl font-bold tracking-tight">{item.value}</p>
              </div>
              <div
                className={`${item.color} bg-secondary/50 p-2.5 transition-all ease-in-out group-hover:scale-115 group-hover:bg-light2`}
              >
                <item.icon className="h-5 w-5" />
              </div>
            </div>
            <p className="text-xs text-light2 font-medium flex items-center gap-1.5">
                {item.description}
              </p>
          </Card>
        </a>
      ))}
    </div>
  );
};

export const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  return (
    <div
      className={cn(
        "h-full w-full p-1 overflow-hidden rounded-sm bg-dark2 border-1 hover:border-light1/50 relative z-20",
        className
      )}
    >
      <div
        style={{
          animationDelay: mounted ? `${1 * 100}ms` : "0ms",
          animationFillMode: "backwards",
        }}
        className="relative z-50 group overflow-hidden border-border bg-dark2 p-6 transition-all hover:border-light1 animate-in fade-in slide-in-from-bottom-4">
        <div className="p-3">{children}</div>
      </div>
    </div>
  );
};
export const CardTitle = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <h4 className={cn("text-zinc-100 font-bold tracking-wide mt-4", className)}>
      {children}
    </h4>
  );
};
export const CardDescription = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "mt-8 text-zinc-400 tracking-wide leading-relaxed text-sm",
        className
      )}
    >
      {children}
    </p>
  );
};
