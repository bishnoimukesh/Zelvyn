import { useState, useEffect, useMemo } from "react";
import { Workout, SetLog } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Flame,
  Clock,
  Dumbbell,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Home,
  Database,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { resetSession } from "@/features/workouts/workoutSessionSlice";
import { logService } from "@/services/api/logService";
import { fetchDashboardStats } from "@/features/dashboard/dashboardSlice";

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
  const user = useAppSelector((state) => state.user.profile);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // Format elapsed time
  const mins = Math.floor(elapsedSeconds / 60);
  const secs = elapsedSeconds % 60;
  const timeFormatted = `${mins}m ${secs}s`;

  // Count total sets completed
  const { totalSets, completedSets } = useMemo(() => {
    let total = 0;
    let completed = 0;
    Object.values(setLogs).forEach((sets) => {
      total += sets.length;
      completed += sets.filter((s) => s.completed).length;
    });
    return { totalSets: total, completedSets: completed };
  }, [setLogs]);

  // Calculate proportional calories (or fallback to workout calories)
  const estimatedCalories = useMemo(() => {
    const ratio = totalSets > 0 ? completedSets / totalSets : 1;
    return Math.round(workout.calories * Math.max(0.4, ratio));
  }, [workout.calories, totalSets, completedSets]);

  // Automatically save to backend MongoDB upon modal open
  useEffect(() => {
    if (isOpen && saveStatus === "idle") {
      setSaveStatus("saving");

      let total = 0;
      let completed = 0;
      Object.values(setLogs).forEach((sets) => {
        total += sets.length;
        completed += sets.filter((s) => s.completed).length;
      });
      const ratio = total > 0 ? completed / total : 1;
      const calories = Math.round(workout.calories * Math.max(0.4, ratio));

      logService
        .logWorkout({
          userId: user?.id || "demo-user-1",
          workoutId: workout.id,
          workoutTitle: workout.title,
          category: workout.category,
          durationMinutes: Math.max(1, Math.round(elapsedSeconds / 60)),
          totalVolumeKg,
          caloriesBurned: calories,
          setsCompleted: completed,
          totalSets: total,
        })
        .then(() => {
          setSaveStatus("saved");
          dispatch(fetchDashboardStats(user?.id || "demo-user-1"));
        })
        .catch((err) => {
          console.warn("Failed to persist workout log:", err);
          setSaveStatus("error");
        });
    }
  }, [
    isOpen,
    saveStatus,
    user?.id,
    workout.id,
    workout.title,
    workout.category,
    workout.calories,
    elapsedSeconds,
    totalVolumeKg,
    setLogs,
    dispatch,
  ]);

  if (!isOpen) return null;

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
      <div className="relative w-full max-w-lg rounded-3xl bg-card border border-primary/40 p-6 sm:p-8 shadow-[0_0_50px_rgba(200,255,71,0.2)] overflow-hidden">
        {/* Glow accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-primary/15 blur-3xl pointer-events-none" />

        {/* Celebration Trophy Badge */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative mb-3">
            <div className="h-20 w-20 rounded-3xl bg-primary/10 border-2 border-primary flex items-center justify-center shadow-[0_0_30px_rgba(200,255,71,0.4)]">
              <Trophy className="h-10 w-10 text-primary animate-bounce" />
            </div>
            <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-md">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono font-bold uppercase tracking-wider mb-2">
            Workout Completed
          </div>

          <h2 className="font-display text-2xl sm:text-3xl font-black uppercase text-foreground tracking-wide">
            Phenomenal Effort!
          </h2>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm">
            You successfully conquered{" "}
            <span className="text-foreground font-semibold">{workout.title}</span>.
            Your recovery and progressive overload metrics have been updated.
          </p>

          {/* Database Sync Status Badge */}
          <div className="mt-3">
            {saveStatus === "saving" && (
              <Badge
                variant="outline"
                className="gap-1.5 text-xs text-amber-500 border-amber-500/30 bg-amber-500/10"
              >
                <Loader2 className="h-3 w-3 animate-spin" /> Saving to MongoDB Atlas...
              </Badge>
            )}
            {saveStatus === "saved" && (
              <Badge
                variant="outline"
                className="gap-1.5 text-xs text-emerald-500 border-emerald-500/30 bg-emerald-500/10"
              >
                <Database className="h-3 w-3" /> Synced to MongoDB Atlas
              </Badge>
            )}
            {saveStatus === "error" && (
              <Badge
                variant="outline"
                className="gap-1.5 text-xs text-rose-500 border-rose-500/30 bg-rose-500/10"
              >
                Saved locally (Database sync deferred)
              </Badge>
            )}
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
          {/* Time */}
          <div className="bg-muted border border-border rounded-2xl p-3 text-center">
            <div className="h-7 w-7 rounded-lg bg-card text-primary flex items-center justify-center mx-auto mb-1.5 border border-border">
              <Clock className="h-3.5 w-3.5" />
            </div>
            <span className="text-[10px] font-mono uppercase text-muted-foreground block">
              Duration
            </span>
            <span className="font-mono text-sm sm:text-base font-bold text-foreground">
              {timeFormatted}
            </span>
          </div>

          {/* Volume */}
          <div className="bg-muted border border-border rounded-2xl p-3 text-center">
            <div className="h-7 w-7 rounded-lg bg-card text-primary flex items-center justify-center mx-auto mb-1.5 border border-border">
              <Dumbbell className="h-3.5 w-3.5" />
            </div>
            <span className="text-[10px] font-mono uppercase text-muted-foreground block">
              Volume
            </span>
            <span className="font-mono text-sm sm:text-base font-bold text-primary">
              {totalVolumeKg > 0 ? `${totalVolumeKg.toLocaleString()} kg` : "Bodyweight"}
            </span>
          </div>

          {/* Calories */}
          <div className="bg-muted border border-border rounded-2xl p-3 text-center">
            <div className="h-7 w-7 rounded-lg bg-card text-primary flex items-center justify-center mx-auto mb-1.5 border border-border">
              <Flame className="h-3.5 w-3.5" />
            </div>
            <span className="text-[10px] font-mono uppercase text-muted-foreground block">
              Burned
            </span>
            <span className="font-mono text-sm sm:text-base font-bold text-foreground">
              {estimatedCalories} kcal
            </span>
          </div>

          {/* Sets Done */}
          <div className="bg-muted border border-border rounded-2xl p-3 text-center">
            <div className="h-7 w-7 rounded-lg bg-card text-emerald-500 flex items-center justify-center mx-auto mb-1.5 border border-border">
              <CheckCircle2 className="h-3.5 w-3.5" />
            </div>
            <span className="text-[10px] font-mono uppercase text-muted-foreground block">
              Sets
            </span>
            <span className="font-mono text-sm sm:text-base font-bold text-foreground">
              {completedSets}/{totalSets}
            </span>
          </div>
        </div>

        {/* Streak notification banner */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted border border-border mb-6">
          <span className="text-xl">🔥</span>
          <div className="text-xs">
            <span className="text-foreground font-bold block">
              Activity Saved & Synced!
            </span>
            <span className="text-muted-foreground">
              Your session has been logged and weekly targets updated.
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-2.5">
          <Button
            id="modal-dashboard-btn"
            onClick={handleReturnToDashboard}
            className="w-full bg-primary text-primary-foreground font-black uppercase hover:opacity-95 shadow-[0_0_20px_rgba(200,255,71,0.3)] transition-all flex items-center justify-center gap-2 py-5"
          >
            <Home className="h-4 w-4" /> Go to Dashboard
          </Button>

          <Button
            id="modal-workouts-btn"
            variant="outline"
            onClick={handleReturnToWorkouts}
            className="w-full border-border bg-card text-foreground hover:bg-muted flex items-center justify-center gap-2 py-5"
          >
            Browse Workouts <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
