import { useState } from "react";
import { useAppSelector } from "@/app/hooks";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { History, Clock, Flame, Dumbbell, CheckCircle2, Filter } from "lucide-react";
import { cn } from "@/lib/utils";

export function WorkoutHistoryList() {
  const workoutHistory = useAppSelector((state) => state.progress.workoutHistory);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = ["all", "strength", "hiit", "cardio", "mobility"];

  const filteredHistory =
    selectedCategory === "all"
      ? workoutHistory
      : workoutHistory.filter((item) => item.category === selectedCategory);

  return (
    <Card className="p-4 sm:p-6 border-border bg-card" id="workout-history-card">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
            <History className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">
              Completed Workout History
            </h3>
            <span className="text-xs text-muted-foreground">
              {workoutHistory.length} total sessions logged
            </span>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="h-3.5 w-3.5 text-muted-foreground mr-1 flex-shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              id={`filter-hist-${cat}`}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-mono font-bold capitalize transition-all whitespace-nowrap",
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:text-foreground border border-border"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* History Items List */}
      {filteredHistory.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground text-xs font-mono bg-muted/60 rounded-2xl border border-border">
          No workout sessions recorded for "{selectedCategory}".
        </div>
      ) : (
        <div className="space-y-2.5" id="workout-history-list">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="group p-3 sm:p-4 rounded-2xl bg-muted/60 border border-border hover:border-border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              {/* Left Details */}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-muted border border-border text-foreground flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="font-display text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      {item.workoutTitle}
                    </span>
                    <Badge variant="secondary" className="text-[10px] uppercase font-mono py-0 px-1.5">
                      {item.category}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">
                    {item.date}
                  </span>
                </div>
              </div>

              {/* Right Metrics Grid */}
              <div className="flex items-center gap-3 sm:gap-5 font-mono text-xs text-muted-foreground flex-wrap justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-border">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  {item.durationMinutes}m
                </span>

                <span className="flex items-center gap-1">
                  <Flame className="h-3.5 w-3.5 text-primary" />
                  {item.caloriesBurned} kcal
                </span>

                <span className="flex items-center gap-1">
                  <Dumbbell className="h-3.5 w-3.5 text-primary" />
                  {item.totalVolumeKg > 0
                    ? `${item.totalVolumeKg.toLocaleString()} kg`
                    : "Bodyweight"}
                </span>

                <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 text-[11px]">
                  {item.setsCompleted}/{item.totalSets} Sets
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
