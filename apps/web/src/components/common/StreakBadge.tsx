import React from "react";
import { Flame } from "lucide-react";
import { cn } from "@/lib/utils";

interface StreakBadgeProps {
  days?: number;
  className?: string;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({
  days = 5,
  className,
  size = "md",
  animated = true,
}) => {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-[#C8FF47]/25 bg-[#C8FF47]/10 font-bold text-[#C8FF47] transition-all hover:bg-[#C8FF47]/20 hover:border-[#C8FF47]/40 shadow-[0_0_12px_rgba(200,255,71,0.15)]",
        size === "sm" && "px-2 py-0.5 text-[11px]",
        size === "md" && "px-3 py-1 text-xs",
        size === "lg" && "px-4 py-1.5 text-sm",
        className
      )}
      title={`${days} Days Continuous Workout Streak`}
    >
      <span className={cn("relative flex items-center justify-center", animated && "animate-pulse")}>
        <Flame className={cn("fill-current", size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5")} />
      </span>
      <span className="font-mono tracking-wider font-extrabold uppercase">
        {days} DAYS
      </span>
    </div>
  );
};
