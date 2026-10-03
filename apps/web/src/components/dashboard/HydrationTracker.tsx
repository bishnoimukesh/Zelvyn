import React from "react";
import { Droplet, Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { addWater } from "@/features/dashboard/dashboardSlice";

export const HydrationTracker: React.FC = () => {
  const dispatch = useAppDispatch();
  const hydration = useAppSelector(
    (state) => state.dashboard.metrics.hydration
  );

  const percentage = Math.min(
    Math.round((hydration.current / hydration.target) * 100),
    100
  );

  return (
    <Card className="border border-[#222228] bg-[#111115] p-5">
      <CardHeader className="p-0 pb-3 flex flex-row items-center justify-between">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#71717A]">
            Hydration
          </span>
          <CardTitle className="font-display text-lg font-black uppercase text-white mt-0.5">
            Water Intake
          </CardTitle>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
          <Droplet className="h-4 w-4 fill-current" />
        </div>
      </CardHeader>

      <CardContent className="p-0 space-y-4">
        {/* Value and percentage */}
        <div className="flex items-baseline justify-between">
          <div className="flex items-baseline gap-1">
            <span className="font-display text-3xl font-black text-white">
              {(hydration.current / 1000).toFixed(2)}
            </span>
            <span className="text-xs font-mono font-semibold text-[#A1A1AA]">
              L
            </span>
            <span className="text-[11px] font-mono text-[#71717A] ml-1">
              / {(hydration.target / 1000).toFixed(1)} L Target
            </span>
          </div>
          <span className="text-xs font-mono font-bold text-cyan-400">
            {percentage}%
          </span>
        </div>

        {/* Progress bar */}
        <Progress value={percentage} className="h-2 bg-[#1A1A1F]" />

        {/* Quick Log Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <Button
            size="sm"
            variant="outline"
            onClick={() => dispatch(addWater(250))}
            className="flex-1 gap-1 border-[#222228] bg-[#14141A] text-xs font-mono font-bold text-white hover:border-cyan-500/40 hover:text-cyan-400 transition-colors"
          >
            <Plus className="h-3 w-3" /> 250ml
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => dispatch(addWater(500))}
            className="flex-1 gap-1 border-[#222228] bg-[#14141A] text-xs font-mono font-bold text-white hover:border-cyan-500/40 hover:text-cyan-400 transition-colors"
          >
            <Plus className="h-3 w-3" /> 500ml
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
