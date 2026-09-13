import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Workout } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  Play,
  CalendarPlus,
  Clock,
  Flame,
  Check,
} from "lucide-react";
import { useAppDispatch } from "@/app/hooks";
import { assignWorkoutToDay } from "@/features/planner/plannerSlice";
import { addWorkout } from "@/features/workouts/workoutsSlice";
import { startSession } from "@/features/workouts/workoutSessionSlice";

interface GeneratedWorkoutCardProps {
  workout: Workout;
}

export function GeneratedWorkoutCard({ workout }: GeneratedWorkoutCardProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [added, setAdded] = useState(false);

  const handleAddToPlanner = () => {
    dispatch(addWorkout(workout));
    dispatch(
      assignWorkoutToDay({
        day: "Tuesday",
        workoutId: workout.id,
      })
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 3000);
  };

  const handleTrainNow = () => {
    dispatch(addWorkout(workout));
    dispatch(startSession(workout));
    navigate(`/workouts/${workout.id}`);
  };

  return (
    <Card className="mt-3 p-4 rounded-2xl bg-[#141814] border border-[#C8FF47]/40 shadow-[0_0_25px_rgba(200,255,71,0.15)] relative overflow-hidden text-left" id="generated-workout-card">
      {/* Glow accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#C8FF47]/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#C8FF47] text-black shadow-sm">
            <Sparkles className="h-3 w-3 fill-current" /> AI Generated Routine
          </span>
          <Badge variant="secondary" className="text-[10px] font-mono uppercase py-0">
            {workout.category}
          </Badge>
          <Badge variant="outline" className="text-[10px] font-mono uppercase text-[#C8FF47] border-[#C8FF47]/30 py-0">
            {workout.difficulty}
          </Badge>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-[#A1A1AA]">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-[#C8FF47]" /> {workout.duration}m
          </span>
          <span className="flex items-center gap-1">
            <Flame className="h-3.5 w-3.5 text-[#C8FF47]" /> {workout.calories} kcal
          </span>
        </div>
      </div>

      <h3 className="font-display text-base sm:text-lg font-bold uppercase text-white tracking-wide mb-1">
        {workout.title}
      </h3>
      <p className="text-xs text-[#A1A1AA] leading-relaxed mb-3">
        {workout.description}
      </p>

      {/* Exercises mini roster */}
      {workout.exercises && workout.exercises.length > 0 && (
        <div className="space-y-1.5 mb-4 pt-2 border-t border-[#222228]">
          <span className="text-[10px] font-mono uppercase font-bold text-[#71717A] block mb-1">
            Prescribed Movements ({workout.exercises.length})
          </span>
          {workout.exercises.map((ex, idx) => (
            <div
              key={ex.id || idx}
              className="flex items-center justify-between gap-2 p-2 rounded-xl bg-[#1A1E14] border border-[#2A3622] text-xs font-mono"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="h-5 w-5 rounded bg-[#C8FF47]/20 text-[#C8FF47] font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                  {idx + 1}
                </span>
                <span className="text-white font-semibold truncate">{ex.name}</span>
                <span className="text-[10px] text-[#71717A] hidden sm:inline truncate">
                  ({ex.targetMuscle})
                </span>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-[#C8FF47] font-bold flex-shrink-0">
                <span>{ex.sets} sets × {ex.reps}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Action CTA Buttons */}
      <div className="flex items-center gap-2 flex-wrap pt-1">
        <Button
          id="train-now-ai-btn"
          size="sm"
          onClick={handleTrainNow}
          className="bg-[#C8FF47] text-black font-black uppercase text-xs hover:bg-[#b5f030] shadow-[0_0_15px_rgba(200,255,71,0.25)] flex items-center gap-1.5"
        >
          <Play className="h-3.5 w-3.5 fill-current" /> Train Now
        </Button>

        <Button
          id="add-planner-ai-btn"
          size="sm"
          variant="outline"
          onClick={handleAddToPlanner}
          disabled={added}
          className="border-[#2A3622] bg-[#1A1E14] text-white hover:bg-[#232B1C] text-xs flex items-center gap-1.5"
        >
          {added ? (
            <>
              <Check className="h-3.5 w-3.5 text-[#C8FF47]" /> Added to Tuesday Plan!
            </>
          ) : (
            <>
              <CalendarPlus className="h-3.5 w-3.5 text-[#C8FF47]" /> Add to Weekly Planner
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
