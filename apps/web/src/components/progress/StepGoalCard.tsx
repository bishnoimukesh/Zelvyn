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
    <Card className="p-4 sm:p-6 border-border bg-card space-y-4" id="step-goal-card">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
            <Footprints className="h-4 w-4" />
          </div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">
            Daily Step Target & NEAT
          </h3>
        </div>

        <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20 font-bold">
          {progressPercent}% Goal
        </span>
      </div>

      {/* Main Stats Display */}
      <div className="flex items-end justify-between">
        <div>
          <span className="font-display text-3xl font-black text-foreground">
            {todaySteps.toLocaleString()}
          </span>
          <span className="text-xs font-mono text-muted-foreground ml-2">
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
      <div className="w-full bg-muted h-2 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full transition-all duration-300"
          style={{ width: `${Math.min(100, progressPercent)}%` }}
        />
      </div>

      {/* Distance & Burn Metrics */}
      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="bg-muted/60 p-2.5 rounded-xl border border-border flex items-center gap-2">
          <MapPin className="h-3.5 w-3.5 text-primary" />
          <div>
            <span className="text-muted-foreground text-[10px] uppercase block">Est. Distance</span>
            <span className="text-foreground font-bold">{distanceKm} km</span>
          </div>
        </div>

        <div className="bg-muted/60 p-2.5 rounded-xl border border-border flex items-center gap-2">
          <Footprints className="h-3.5 w-3.5 text-primary" />
          <div>
            <span className="text-muted-foreground text-[10px] uppercase block">NEAT Burn</span>
            <span className="text-foreground font-bold">{stepCalories} kcal</span>
          </div>
        </div>
      </div>

      {/* 7-Day Mini Distribution Bars */}
      <div>
        <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-2 font-bold">
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
                  className="w-full bg-muted rounded-t flex items-end justify-center overflow-hidden h-12"
                >
                  <div
                    className={`w-full transition-all duration-300 ${
                      isToday ? "bg-primary" : item.steps >= item.goal ? "bg-primary/70" : "bg-primary/30"
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className={`text-[10px] font-mono ${isToday ? "text-primary font-bold" : "text-muted-foreground"}`}>
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions to Add Steps */}
      <div className="pt-2 border-t border-border flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground font-mono">Quick Log:</span>
        <div className="flex items-center gap-1.5">
          <Button
            id="add-500-steps-btn"
            size="sm"
            variant="outline"
            onClick={() => dispatch(logStepsToday(500))}
            className="h-7 px-2.5 rounded-lg border-border bg-muted text-xs font-mono text-muted-foreground hover:text-foreground hover:border-primary"
          >
            <Plus className="h-3 w-3 mr-0.5" /> 500
          </Button>

          <Button
            id="add-1000-steps-btn"
            size="sm"
            variant="outline"
            onClick={() => dispatch(logStepsToday(1000))}
            className="h-7 px-2.5 rounded-lg border-border bg-muted text-xs font-mono text-muted-foreground hover:text-foreground hover:border-primary"
          >
            <Plus className="h-3 w-3 mr-0.5" /> 1,000
          </Button>
        </div>
      </div>
    </Card>
  );
}
