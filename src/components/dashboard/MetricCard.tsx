import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string | number;
  unit: string;
  target?: string | number;
  percentage?: number;
  subtext?: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor?: string;
  className?: string;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  unit,
  target,
  percentage,
  subtext,
  icon: Icon,
  className,
  onClick,
}) => {
  const calcPercent =
    percentage !== undefined
      ? percentage
      : target && typeof value === "number" && typeof target === "number"
      ? Math.min(Math.round((value / target) * 100), 100)
      : undefined;

  return (
    <Card
      onClick={onClick}
      className={cn(
        "relative overflow-hidden border border-[#222228] bg-[#111115] p-4 transition-all duration-200 hover:border-[#C8FF47]/40 hover:shadow-[0_0_15px_rgba(200,255,71,0.08)] group",
        onClick && "cursor-pointer",
        className
      )}
    >
      {/* Top Header: Label & Icon */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#71717A] group-hover:text-[#A1A1AA] transition-colors">
          {title}
        </span>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C8FF47]/10 text-[#C8FF47] transition-transform duration-200 group-hover:scale-110 shadow-[0_0_10px_rgba(200,255,71,0.15)]">
          <Icon className="h-4 w-4" />
        </div>
      </div>

      {/* Numerical Value */}
      <CardContent className="p-0 mt-2">
        <div className="flex items-baseline gap-1.5">
          <span className="font-display text-3xl sm:text-4xl font-black tracking-tight text-white">
            {typeof value === "number" ? value.toLocaleString() : value}
          </span>
          <span className="text-xs font-mono font-semibold text-[#A1A1AA]">
            {unit}
          </span>
          {target !== undefined && (
            <span className="text-[11px] font-mono text-[#71717A] ml-auto">
              / {typeof target === "number" ? target.toLocaleString() : target} {unit}
            </span>
          )}
        </div>

        {/* Progress Bar */}
        {calcPercent !== undefined && (
          <div className="mt-3 space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono text-[#71717A]">
              <span>Progress</span>
              <span className="font-bold text-[#C8FF47]">{calcPercent}%</span>
            </div>
            <Progress value={calcPercent} className="h-1.5 bg-[#1A1A1F]" />
          </div>
        )}

        {/* Subtext info */}
        {subtext && (
          <p className="mt-2 text-[11px] font-medium text-[#71717A]">
            {subtext}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
