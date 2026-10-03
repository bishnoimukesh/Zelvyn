import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Calendar, RefreshCw, AlertCircle, Database, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { PageContainer } from "@/components/layout/PageContainer";
import { WorkoutFilters } from "@/components/planner/WorkoutFilters";
import { WorkoutCard } from "@/components/planner/WorkoutCard";
import { openAssignModal } from "@/features/planner/plannerSlice";
import { AssignWorkoutModal } from "@/components/planner/AssignWorkoutModal";
import { fetchWorkouts, clearError } from "@/features/workouts/workoutsSlice";
import { ROUTES } from "@/constants/routes";

export function WorkoutsPage() {
  const dispatch = useAppDispatch();
  const { items: workouts, filters, loading, error, isLiveSynced } = useAppSelector(
    (state) => state.workouts
  );

  // Sync workouts from backend API on mount
  useEffect(() => {
    dispatch(fetchWorkouts());
  }, [dispatch]);

  // Multi-dimensional filtering logic
  const filteredWorkouts = useMemo(() => {
    return workouts.filter((w) => {
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchTitle = w.title.toLowerCase().includes(q);
        const matchDesc = w.description?.toLowerCase().includes(q);
        const matchMuscle = w.bodyPart?.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchMuscle) return false;
      }

      if (filters.category !== "all" && w.category !== filters.category) {
        return false;
      }

      if (filters.goal !== "all" && w.targetGoal !== filters.goal) {
        return false;
      }

      if (filters.equipment !== "all" && w.equipment !== filters.equipment) {
        return false;
      }

      if (filters.bodyPart !== "all" && w.bodyPart !== filters.bodyPart) {
        return false;
      }

      if (filters.difficulty !== "all" && w.difficulty !== filters.difficulty) {
        return false;
      }

      if (filters.duration !== "all") {
        if (filters.duration === "short" && w.duration >= 25) return false;
        if (
          filters.duration === "medium" &&
          (w.duration < 25 || w.duration > 40)
        )
          return false;
        if (filters.duration === "long" && w.duration <= 40) return false;
      }

      return true;
    });
  }, [workouts, filters]);

  return (
    <PageContainer
      title="Workout Library"
      description="Explore targeted routines filtered by category, goal, equipment, duration, and muscle groups."
      badge="Catalog"
      action={
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => dispatch(fetchWorkouts())}
            disabled={loading}
            className="gap-1.5 text-xs font-semibold border-[#222228] hover:bg-[#18181D]"
            title="Refresh workouts from backend"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-[#10B981]" : "text-[#71717A]"}`} />
            {loading ? "Syncing..." : "Sync DB"}
          </Button>

          <Link to={ROUTES.PLANNER}>
            <Button size="sm" variant="outline" className="gap-1.5 font-bold">
              <Calendar className="h-4 w-4" /> Open 7-Day Planner
            </Button>
          </Link>
        </div>
      }
    >
      {/* Live Data Connectivity Status Banner */}
      <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#111116] border border-[#222228] mb-1">
        <div className="flex items-center gap-2">
          <div className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isLiveSynced ? "bg-[#10B981]" : "bg-amber-400"
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isLiveSynced ? "bg-[#10B981]" : "bg-amber-500"
              }`}
            />
          </div>
          <span className="text-xs font-medium text-[#A1A1AA]">
            {isLiveSynced
              ? "Live REST API Connected • Real-time DB Synced"
              : "Connecting to FitSync REST API..."}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="text-[10px] font-mono border-[#27272A] text-[#10B981] bg-[#10B981]/10 gap-1 py-0.5"
          >
            <Database className="h-3 w-3" />
            {isLiveSynced ? "Backend Synced" : "Buffering"}
          </Badge>
        </div>
      </div>

      {/* Error Alert if API failed */}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5 text-xs text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                dispatch(clearError());
                dispatch(fetchWorkouts());
              }}
              className="text-xs h-7 border-rose-500/30 text-rose-300 hover:bg-rose-500/20"
            >
              Retry
            </Button>
          </div>
        </div>
      )}

      <WorkoutFilters />

      <div className="pt-2">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-[#71717A]">
            Showing {filteredWorkouts.length} of {workouts.length} available workouts
          </p>
          {isLiveSynced && (
            <span className="text-[11px] text-[#10B981] flex items-center gap-1 font-medium">
              <CheckCircle2 className="h-3 w-3" /> Up to date
            </span>
          )}
        </div>

        {/* Loading skeletons if initial load */}
        {loading && workouts.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-[#222228] bg-[#111116] p-4 h-[320px] animate-pulse flex flex-col justify-between"
              >
                <div className="w-full h-44 bg-[#18181D] rounded-xl" />
                <div className="space-y-2 mt-3">
                  <div className="h-4 bg-[#18181D] rounded w-3/4" />
                  <div className="h-3 bg-[#18181D] rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredWorkouts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[#222228] p-12 text-center">
            <p className="text-sm font-bold text-white">No workouts match your filter criteria</p>
            <p className="text-xs text-[#71717A] mt-1">Try resetting filters to explore all routines.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWorkouts.map((w) => (
              <WorkoutCard
                key={w.id}
                workout={w}
                onSchedule={(_id) => dispatch(openAssignModal("Monday"))}
              />
            ))}
          </div>
        )}
      </div>

      <AssignWorkoutModal />
    </PageContainer>
  );
}
