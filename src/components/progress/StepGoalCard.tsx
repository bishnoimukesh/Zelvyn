import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Footprints, Plus, CheckCircle2, MapPin } from "lucide-react";
import { logStepsToday } from "@/features/progress/progressSlice";

export function StepGoalCard() {
  const dispatch = useAppDispatch();
  const { stepTracker } = useAppSelector((state) => state.progress);

  const { todaySteps, goalSteps, weeklyDistribution } = stepTracker;
  const progressPercent = Math.min(
    150,
    Math.round((todaySteps / goalSteps) * 100)
  );
  const isGoalAchieved = todaySteps >= goalSteps;

  // Approximate distance (1 step ~ 0.76m) and calories
  const distanceKm = ((todaySteps * 0.76) / 1000).toFixed(1);
  const stepCalories = Math.round(todaySteps * 0.04);

  return (
    <Card className="p-4 sm:p-6 border-[#222228] bg-[#121216] space-y-4" id="step-goal-card">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-[#C8FF47]/10 border border-[#C8FF47]/20 text-[#C8FF47] flex items-center justify-center">
            <Footprints className="h-4 w-4" />
          </div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
            Daily Step Target & NEAT
          </h3>
        </div>

        <span className="text-xs font-mono text-[#C8FF47] bg-[#C8FF47]/10 px-2 py-0.5 rounded border border-[#C8FF47]/20 font-bold">
          {progressPercent}% Goal
        </span>
      </div>

      {/* Main Stats Display */}
      <div className="flex items-end justify-between">
        <div>
          <span className="font-display text-3xl font-black text-white">
            {todaySteps.toLocaleString()}
          </span>
          <span className="text-xs font-mono text-[#71717A] ml-2">
            / {goalSteps.toLocaleString()} target steps
          </span>
        </div>

        {isGoalAchieved && (
          <span className="text-xs text-emerald-400 font-bold flex items-center gap-1 font-mono">
            <CheckCircle2 className="h-3.5 w-3.5" /> Target Conquered
          </span>
        )}
      </div>

      {/* Progress Line */}
      <div className="w-full bg-[#1F1F28] h-2 rounded-full overflow-hidden">
        <div
          className="h-full bg-[#C8FF47] rounded-full transition-all duration-300"
          style={{ width: `${Math.min(100, progressPercent)}%` }}
        />
      </div>

      {/* Distance & Burn Metrics */}
      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="bg-[#181820] p-2.5 rounded-xl border border-[#222228] flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-[#C8FF47]" />
          <div>
            <span className="text-[#71717A] text-[10px] uppercase block">Est. Distance</span>
            <span className="text-white font-bold">{distanceKm} km</span>
          </div>
        </div>

        <div className="bg-[#181820] p-2.5 rounded-xl border border-[#222228] flex items-center gap-2">
          <Footprints className="h-3.5 w-3.5 text-[#C8FF47]" />
          <div>
            <span className="text-[#71717A] text-[10px] uppercase block">NEAT Burn</span>
            <span className="text-white font-bold">{stepCalories} kcal</span>
          </div>
        </div>
      </div>

      {/* 7-Day Mini Distribution Bars */}
      <div>
        <span className="text-[10px] font-mono uppercase tracking-wider text-[#71717A] block mb-2 font-bold">
          Weekly Microcycle Steps
        </span>
        <div className="grid grid-cols-7 gap-1.5 items-end h-16 pt-2">
          {weeklyDistribution.map((item, idx) => {
            const heightPercent = Math.min(100, (item.steps / 13000) * 100);
            const isToday = idx === weeklyDistribution.length - 1;
            return (
              <div key={item.day} className="flex flex-col items-center gap-1">
                <div
                  title={`${item.day}: ${item.steps.toLocaleString()} steps`}
                  className="w-full bg-[#1F1F28] rounded-t flex items-end justify-center overflow-hidden h-12"
                >
                  <div
                    className={`w-full transition-all duration-300 ${
                      isToday ? "bg-[#C8FF47]" : item.steps >= item.goal ? "#7CA822 bg-lime-600" : "bg-[#3D5215]"
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className={`text-[10px] font-mono ${isToday ? "text-[#C8FF47] font-bold" : "text-[#71717A]"}`}>
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions to Add Steps */}
      <div className="pt-2 border-t border-[#222228] flex items-center justify-between gap-2">
        <span className="text-xs text-[#71717A] font-mono">Quick Log:</span>
        <div className="flex items-center gap-1.5">
          <Button
            id="add-500-steps-btn"
            size="sm"
            variant="outline"
            onClick={() => dispatch(logStepsToday(500))}
            className="h-7 px-2.5 rounded-lg border-[#2A2A36] bg-[#181820] text-xs font-mono text-[#A1A1AA] hover:text-white hover:border-[#C8FF47]"
          >
            <Plus className="h-3 w-3 mr-0.5" /> 500
          </Button>

          <Button
            id="add-1000-steps-btn"
            size="sm"
            variant="outline"
            onClick={() => dispatch(logStepsToday(1000))}
            className="h-7 px-2.5 rounded-lg border-[#2A2A36] bg-[#181820] text-xs font-mono text-[#A1A1AA] hover:text-white hover:border-[#C8FF47]"
          >
            <Plus className="h-3 w-3 mr-0.5" /> 1,000
          </Button>
        </div>
      </div>
    </Card>
  );
}
