import { useMemo } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { openAssignModal } from "@/features/planner/plannerSlice";
import { PageContainer } from "@/components/layout/PageContainer";
import { WeeklyScheduleStrip } from "@/components/planner/WeeklyScheduleStrip";
import { WorkoutFilters } from "@/components/planner/WorkoutFilters";
import { WorkoutCard } from "@/components/planner/WorkoutCard";
import { AssignWorkoutModal } from "@/components/planner/AssignWorkoutModal";

export function PlannerPage() {
  const dispatch = useAppDispatch();
  const workouts = useAppSelector((state) => state.workouts.items);
  const filters = useAppSelector((state) => state.workouts.filters);

  // Multi-dimensional filtering logic
  const filteredWorkouts = useMemo(() => {
    return workouts.filter((w) => {
      // Search query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchTitle = w.title.toLowerCase().includes(q);
        const matchDesc = w.description?.toLowerCase().includes(q);
        const matchMuscle = w.bodyPart?.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchMuscle) return false;
      }

      // Category
      if (filters.category !== "all" && w.category !== filters.category) {
        return false;
      }

      // Goal
      if (filters.goal !== "all" && w.targetGoal !== filters.goal) {
        return false;
      }

      // Equipment
      if (filters.equipment !== "all" && w.equipment !== filters.equipment) {
        return false;
      }

      // Body Part
      if (filters.bodyPart !== "all" && w.bodyPart !== filters.bodyPart) {
        return false;
      }

      // Difficulty
      if (filters.difficulty !== "all" && w.difficulty !== filters.difficulty) {
        return false;
      }

      // Duration
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
      title="Workout Planner & Catalog"
      description="Plan your 7-day training microcycle, customize exercise splits, and explore targeted routines."
      badge="Planner Active"
      action={
        <Button
          size="sm"
          onClick={() => dispatch(openAssignModal("Monday"))}
          className="gap-1.5 font-bold shadow-[0_0_12px_rgba(200,255,71,0.25)]"
        >
          <Plus className="h-4 w-4" /> Schedule Routine
        </Button>
      }
    >
      {/* 7-Day Interactive Weekly Schedule Strip */}
      <WeeklyScheduleStrip />

      {/* Filter Toolbar */}
      <div className="pt-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="font-display text-xl sm:text-2xl font-black uppercase text-white">
              Targeted Routine Library
            </h3>
            <p className="text-xs text-[#71717A]">
              Showing {filteredWorkouts.length} of {workouts.length} routines
            </p>
          </div>
        </div>

        <WorkoutFilters />
      </div>

      {/* Filtered Workouts Grid */}
      {filteredWorkouts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#222228] p-12 text-center">
          <p className="text-sm font-bold text-white">No workouts match the selected filters</p>
          <p className="text-xs text-[#71717A] mt-1">
            Try resetting your filters or adjusting your search query.
          </p>
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

      {/* Modals */}
      <AssignWorkoutModal />
    </PageContainer>
  );
}
