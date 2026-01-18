import { cn } from "@/lib/utils"

interface SpinnerProps {
  className?: string
  size?: "sm" | "md" | "lg"
}

export function Spinner({ className, size = "md" }: SpinnerProps) {
  const sizeClasses = {
    sm: "w-[28px] h-[28px]",
    md: "w-[44px] h-[44px]",
    lg: "w-[60px] h-[60px]"
  }

  // Translate Z values need to scale with size
  const translateZ = {
    sm: 14,
    md: 22,
    lg: 30
  }

//   const zValue = translateZ[size]

//   return (
//     <div className={cn("spinner", sizeClasses[size], className)}>
//       <div style={{ transform: `translateZ(-${zValue}px) rotateY(180deg)` }}></div>
//       <div></div>
//       <div></div>
//       <div></div>
//       <div></div>
//       <div style={{ transform: `translateZ(${zValue}px)` }}></div>
//     </div>
//   )
    return (
    <div
      className={cn("spinner text-teal1", sizeClasses[size], className)}
      style={{ "--z": `${translateZ[size]}px` } as React.CSSProperties}
    >
      {/* 6 faces of the cube */}
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
    </div>
  )
}

