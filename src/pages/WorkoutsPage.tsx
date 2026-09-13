import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { PageContainer } from "@/components/layout/PageContainer";
import { WorkoutFilters } from "@/components/planner/WorkoutFilters";
import { WorkoutCard } from "@/components/planner/WorkoutCard";
import { openAssignModal } from "@/features/planner/plannerSlice";
import { AssignWorkoutModal } from "@/components/planner/AssignWorkoutModal";
import { ROUTES } from "@/constants/routes";

export function WorkoutsPage() {
  const dispatch = useAppDispatch();
  const workouts = useAppSelector((state) => state.workouts.items);
  const filters = useAppSelector((state) => state.workouts.filters);

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
        <Link to={ROUTES.PLANNER}>
          <Button size="sm" variant="outline" className="gap-1.5 font-bold">
            <Calendar className="h-4 w-4" /> Open 7-Day Planner
          </Button>
        </Link>
      }
    >
      <WorkoutFilters />

      <div className="pt-2">
        <p className="text-xs text-[#71717A] mb-3">
          Showing {filteredWorkouts.length} of {workouts.length} available workouts
        </p>

        {filteredWorkouts.length === 0 ? (
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
