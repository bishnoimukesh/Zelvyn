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
      <div className="p-8 text-center text-[#71717A] text-sm bg-[#121216] rounded-2xl border border-[#222228]">
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
                ? "bg-[#181C14] border-[#C8FF47] shadow-[0_0_20px_rgba(200,255,71,0.15)] ring-1 ring-[#C8FF47]/40"
                : allCompleted
                ? "bg-[#141814] border-emerald-500/30 hover:border-emerald-500/60"
                : "bg-[#121216] border-[#222228] hover:border-[#33333E] hover:bg-[#16161C]"
            )}
          >
            {/* Number / Status indicator */}
            <div className="flex-shrink-0 flex items-center justify-center">
              {allCompleted ? (
                <div className="h-9 w-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 fill-emerald-500/20" />
                </div>
              ) : isActive ? (
                <div className="h-9 w-9 rounded-xl bg-[#C8FF47] text-black font-black text-xs font-mono flex items-center justify-center shadow-[0_0_12px_rgba(200,255,71,0.4)]">
                  {String(idx + 1).padStart(2, "0")}
                </div>
              ) : (
                <div className="h-9 w-9 rounded-xl bg-[#1A1A22] text-[#71717A] group-hover:text-white font-mono text-xs font-bold border border-[#2A2A36] flex items-center justify-center">
                  {String(idx + 1).padStart(2, "0")}
                </div>
              )}
            </div>

            {/* Thumbnail */}
            <div className="relative h-14 w-14 sm:h-16 sm:w-16 rounded-xl overflow-hidden bg-[#1A1A22] border border-[#222228] flex-shrink-0">
              <img
                src={exercise.thumbnail}
                alt={exercise.name}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              {isActive && (
                <div className="absolute inset-0 bg-[#C8FF47]/10 border-2 border-[#C8FF47] rounded-xl" />
              )}
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span
                  className={cn(
                    "font-display text-sm sm:text-base font-bold truncate tracking-wide",
                    isActive ? "text-[#C8FF47]" : "text-white"
                  )}
                >
                  {exercise.name}
                </span>
                {isActive && (
                  <Badge className="bg-[#C8FF47] text-black text-[10px] font-black uppercase px-2 py-0.5 tracking-wider">
                    Current
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-[#A1A1AA] flex-wrap">
                <span className="inline-flex items-center gap-1 font-medium text-[#C8FF47]">
                  <Dumbbell className="h-3 w-3" />
                  {exercise.targetMuscle}
                </span>
                <span className="text-[#3F3F46]">·</span>
                <span className="text-[#71717A]">{exercise.equipment}</span>
              </div>

              <div className="flex items-center gap-3 mt-1.5 text-[11px] font-mono font-medium text-[#71717A]">
                <span className="text-white font-semibold">
                  {exercise.sets} sets × {exercise.reps}
                </span>
                <span className="inline-flex items-center gap-1 text-[#A1A1AA]">
                  <Timer className="h-3 w-3 text-[#C8FF47]" />
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
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      : completedSetsCount > 0
                      ? "bg-[#C8FF47]/10 text-[#C8FF47] border-[#C8FF47]/30"
                      : "bg-[#1A1A22] text-[#71717A] border-[#2A2A36]"
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
