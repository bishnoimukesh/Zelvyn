import { Exercise, SetLog } from "@/types";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Dumbbell, Timer } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExerciseListProps {
  exercises: Exercise[];
  activeExerciseIndex?: number;
  onSelectExercise?: (index: number) => void;
  isSessionMode?: boolean;
  setLogs?: Record<string, SetLog[]>;
}

export function ExerciseList({
  exercises,
  activeExerciseIndex = 0,
  onSelectExercise,
  isSessionMode = false,
  setLogs = {},
}: ExerciseListProps) {
  if (!exercises || exercises.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground text-sm bg-card rounded-2xl border border-border">
        No exercises registered for this workout routine.
      </div>
    );
  }

  return (
    <div className="space-y-3" id="exercise-list-container">
      {exercises.map((exercise, idx) => {
        const isActive = isSessionMode && activeExerciseIndex === idx;
        const exerciseSets = setLogs[exercise.id] || [];
        const completedSetsCount = exerciseSets.filter((s) => s.completed).length;
        const allCompleted =
          exerciseSets.length > 0 && completedSetsCount === exerciseSets.length;

        return (
          <div
            key={exercise.id}
            id={`exercise-item-${exercise.id}`}
            onClick={() => onSelectExercise && onSelectExercise(idx)}
            className={cn(
              "group relative flex items-center gap-3.5 p-3 sm:p-4 rounded-2xl border transition-all duration-200 cursor-pointer text-left",
              isActive
                ? "bg-primary/10 border-primary shadow-[0_0_20px_rgba(200,255,71,0.15)] ring-1 ring-primary/40"
                : allCompleted
                ? "bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/60"
                : "bg-card border-border hover:border-primary/50 hover:bg-muted"
            )}
          >
            {/* Number / Status indicator */}
            <div className="flex-shrink-0 flex items-center justify-center">
              {allCompleted ? (
                <div className="h-9 w-9 rounded-xl bg-emerald-500/20 text-emerald-500 border border-emerald-500/40 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 fill-emerald-500/20" />
                </div>
              ) : isActive ? (
                <div className="h-9 w-9 rounded-xl bg-primary text-primary-foreground font-black text-xs font-mono flex items-center justify-center shadow-[0_0_12px_rgba(200,255,71,0.4)]">
                  {String(idx + 1).padStart(2, "0")}
                </div>
              ) : (
                <div className="h-9 w-9 rounded-xl bg-muted text-muted-foreground group-hover:text-foreground font-mono text-xs font-bold border border-border flex items-center justify-center">
                  {String(idx + 1).padStart(2, "0")}
                </div>
              )}
            </div>

            {/* Thumbnail */}
            <div className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-xl overflow-hidden bg-muted border border-border flex-shrink-0">
              <img
                src={exercise.thumbnail}
                alt={exercise.name}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              {isActive && (
                <div className="absolute inset-0 bg-primary/10 border-2 border-primary rounded-xl" />
              )}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span
                  className={cn(
                    "font-display text-sm sm:text-base font-bold truncate tracking-wide",
                    isActive ? "text-primary" : "text-foreground"
                  )}
                >
                  {exercise.name}
                </span>
                {isActive && (
                  <Badge className="bg-primary text-primary-foreground text-[10px] font-black uppercase px-2 py-0.5 tracking-wider">
                    Current
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                <span className="inline-flex items-center gap-1 font-medium text-primary">
                  <Dumbbell className="h-3 w-3" />
                  {exercise.targetMuscle}
                </span>
                <span>·</span>
                <span className="text-muted-foreground">{exercise.equipment}</span>
              </div>

              <div className="flex items-center gap-3 mt-1.5 text-[11px] font-mono font-medium text-muted-foreground">
                <span className="text-foreground font-semibold">
                  {exercise.sets} sets × {exercise.reps}
                </span>
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <Timer className="h-3 w-3 text-primary" />
                  {exercise.restSeconds}s rest
                </span>
              </div>
            </div>

            {/* Session Mode Status Badge */}
            {isSessionMode && (
              <div className="flex-shrink-0 text-right font-mono">
                <span
                  className={cn(
                    "text-xs font-bold px-2.5 py-1 rounded-lg border",
                    allCompleted
                      ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                      : completedSetsCount > 0
                      ? "bg-primary/10 text-primary border-primary/30"
                      : "bg-muted text-muted-foreground border-border"
                  )}
                >
                  {completedSetsCount}/{exercise.sets}
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
