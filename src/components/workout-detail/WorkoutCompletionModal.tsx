import { Workout, SetLog } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Flame,
  Clock,
  Dumbbell,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Home,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useAppDispatch } from "@/app/hooks";
import { resetSession } from "@/features/workouts/workoutSessionSlice";

interface WorkoutCompletionModalProps {
  isOpen: boolean;
  workout: Workout;
  elapsedSeconds: number;
  totalVolumeKg: number;
  setLogs: Record<string, SetLog[]>;
}

export function WorkoutCompletionModal({
  isOpen,
  workout,
  elapsedSeconds,
  totalVolumeKg,
  setLogs,
}: WorkoutCompletionModalProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  if (!isOpen) return null;

  // Format elapsed time
  const mins = Math.floor(elapsedSeconds / 60);
  const secs = elapsedSeconds % 60;
  const timeFormatted = `${mins}m ${secs}s`;

  // Count total sets completed
  let totalSets = 0;
  let completedSets = 0;
  Object.values(setLogs).forEach((sets) => {
    totalSets += sets.length;
    completedSets += sets.filter((s) => s.completed).length;
  });

  // Calculate proportional calories (or fallback to workout calories)
  const ratio = totalSets > 0 ? completedSets / totalSets : 1;
  const estimatedCalories = Math.round(workout.calories * Math.max(0.4, ratio));

  const handleReturnToDashboard = () => {
    dispatch(resetSession());
    navigate(ROUTES.DASHBOARD);
  };

  const handleReturnToWorkouts = () => {
    dispatch(resetSession());
    navigate(ROUTES.WORKOUTS);
  };

  return (
    <div
      id="workout-completion-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-[#121216] border border-[#C8FF47]/40 p-6 sm:p-8 shadow-[0_0_50px_rgba(200,255,71,0.2)] overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-[#C8FF47]/15 blur-3xl pointer-events-none" />

        {/* Celebration Trophy Badge */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative mb-3">
            <div className="h-20 w-20 rounded-3xl bg-[#1A1E14] border-2 border-[#C8FF47] flex items-center justify-center shadow-[0_0_30px_rgba(200,255,71,0.4)]">
              <Trophy className="h-10 w-10 text-[#C8FF47] animate-bounce" />
            </div>
            <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-[#C8FF47] text-black flex items-center justify-center shadow-md">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C8FF47]/10 border border-[#C8FF47]/20 text-[#C8FF47] text-xs font-mono font-bold uppercase tracking-wider mb-2">
            Workout Completed
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-black uppercase text-white tracking-wide">
            Phenomenal Effort!
          </h2>
          <p className="text-xs text-[#A1A1AA] mt-1 max-w-sm">
            You successfully conquered{" "}
            <span className="text-white font-semibold">{workout.title}</span>.
            Your recovery and progressive overload metrics have been updated.
          </p>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
          {/* Time */}
          <div className="bg-[#181820] border border-[#262632] rounded-2xl p-3 text-center">
            <div className="h-7 w-7 rounded-lg bg-[#22222E] text-[#C8FF47] flex items-center justify-center mx-auto mb-1.5">
              <Clock className="h-3.5 w-3.5" />
            </div>
            <span className="text-[10px] font-mono uppercase text-[#71717A] block">
              Duration
            </span>
            <span className="font-mono text-sm sm:text-base font-bold text-white">
              {timeFormatted}
            </span>
          </div>

          {/* Volume */}
          <div className="bg-[#181820] border border-[#262632] rounded-2xl p-3 text-center">
            <div className="h-7 w-7 rounded-lg bg-[#22222E] text-[#C8FF47] flex items-center justify-center mx-auto mb-1.5">
              <Dumbbell className="h-3.5 w-3.5" />
            </div>
            <span className="text-[10px] font-mono uppercase text-[#71717A] block">
              Volume
            </span>
            <span className="font-mono text-sm sm:text-base font-bold text-[#C8FF47]">
              {totalVolumeKg > 0 ? `${totalVolumeKg.toLocaleString()} kg` : "Bodyweight"}
            </span>
          </div>

          {/* Calories */}
          <div className="bg-[#181820] border border-[#262632] rounded-2xl p-3 text-center">
            <div className="h-7 w-7 rounded-lg bg-[#22222E] text-[#C8FF47] flex items-center justify-center mx-auto mb-1.5">
              <Flame className="h-3.5 w-3.5" />
            </div>
            <span className="text-[10px] font-mono uppercase text-[#71717A] block">
              Burned
            </span>
            <span className="font-mono text-sm sm:text-base font-bold text-white">
              {estimatedCalories} kcal
            </span>
          </div>

          {/* Sets Done */}
          <div className="bg-[#181820] border border-[#262632] rounded-2xl p-3 text-center">
            <div className="h-7 w-7 rounded-lg bg-[#22222E] text-emerald-400 flex items-center justify-center mx-auto mb-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </div>
            <span className="text-[10px] font-mono uppercase text-[#71717A] block">
              Sets
            </span>
            <span className="font-mono text-sm sm:text-base font-bold text-white">
              {completedSets}/{totalSets}
            </span>
          </div>
        </div>

        {/* Streak notification banner */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#1A1A22] border border-[#2A2A36] mb-6">
          <span className="text-xl">🔥</span>
          <div className="text-xs">
            <span className="text-white font-bold block">
              7-Day Streak Maintained!
            </span>
            <span className="text-[#A1A1AA]">
              Consistency unlocked: Next milestone in 3 days.
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <Button
            id="modal-dashboard-btn"
            onClick={handleReturnToDashboard}
            className="w-full bg-[#C8FF47] text-black font-black uppercase hover:bg-[#b5f030] shadow-[0_0_20px_rgba(200,255,71,0.3)] transition-all flex items-center justify-center gap-2 py-5"
          >
            <Home className="h-4 w-4" /> Go to Dashboard
          </Button>

          <Button
            id="modal-workouts-btn"
            variant="outline"
            onClick={handleReturnToWorkouts}
            className="w-full border-[#2A2A36] bg-[#181820] text-white hover:bg-[#22222C] flex items-center justify-center gap-2 py-5"
          >
            Browse Workouts <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
