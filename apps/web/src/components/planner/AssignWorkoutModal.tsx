import React, { useState } from "react";
import { X, Search, Clock, Flame, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  closeAssignModal,
  assignWorkoutToDay,
} from "@/features/planner/plannerSlice";

export const AssignWorkoutModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const assignModal = useAppSelector((state) => state.planner.assignModal);
  const workouts = useAppSelector((state) => state.workouts.items);

  const [query, setQuery] = useState("");

  if (!assignModal.isOpen || !assignModal.targetDay) return null;

  const filtered = workouts.filter((w) =>
    w.title.toLowerCase().includes(query.toLowerCase()) ||
    w.category.toLowerCase().includes(query.toLowerCase()) ||
    (w.bodyPart && w.bodyPart.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => dispatch(closeAssignModal())}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl rounded-2xl border border-[#222228] bg-[#0E0E12] p-5 sm:p-6 shadow-2xl z-50 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#222228] pb-3">
          <div>
            <h3 className="font-display text-xl font-black uppercase tracking-wide text-white">
              Assign Routine • {assignModal.targetDay}
            </h3>
            <p className="text-xs text-[#71717A]">
              Select a routine to schedule for {assignModal.targetDay}
            </p>
          </div>
          <button
            type="button"
            onClick={() => dispatch(closeAssignModal())}
            aria-label="Close modal"
            className="rounded-lg border border-[#222228] p-1 text-[#A1A1AA] hover:border-[#C8FF47]/40 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search */}
        <div className="relative my-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#71717A]" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search workouts to schedule..."
            className="pl-8 bg-[#14141A] border-[#222228] text-xs h-9"
          />
        </div>

        {/* Workouts List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1">
          {filtered.map((workout) => (
            <div
              key={workout.id}
              onClick={() =>
                dispatch(
                  assignWorkoutToDay({
                    day: assignModal.targetDay!,
                    workoutId: workout.id,
                  })
                )
              }
              className="flex items-center gap-3 rounded-xl border border-[#222228] bg-[#14141A] p-3 transition-all hover:border-[#C8FF47]/50 hover:bg-[#1A1A1F] cursor-pointer group"
            >
              <img
                src={workout.thumbnail}
                alt={workout.title}
                className="h-14 w-20 rounded-lg object-cover shrink-0"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <Badge variant="default" className="uppercase text-[9px]">
                    {workout.category}
                  </Badge>
                  <span className="text-[10px] font-mono text-[#71717A] capitalize">
                    {workout.difficulty}
                  </span>
                </div>
                <h4 className="font-display text-sm font-bold uppercase text-white group-hover:text-[#C8FF47] transition-colors truncate mt-0.5">
                  {workout.title}
                </h4>
                <div className="flex items-center gap-3 text-[10px] font-mono text-[#A1A1AA] mt-0.5">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-[#C8FF47]" /> {workout.duration}m
                  </span>
                  <span className="flex items-center gap-1">
                    <Flame className="h-3 w-3 text-[#C8FF47]" /> {workout.calories} kcal
                  </span>
                </div>
              </div>

              <Button
                size="sm"
                className="h-8 px-3 text-xs font-bold gap-1 shrink-0 opacity-80 group-hover:opacity-100"
              >
                <Check className="h-3.5 w-3.5" /> Assign
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
