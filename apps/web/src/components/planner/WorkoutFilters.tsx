import React from "react";
import { Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  setSearchQuery,
  setCategoryFilter,
  setGoalFilter,
  setEquipmentFilter,
  setBodyPartFilter,
  setDurationFilter,
  setDifficultyFilter,
  resetFilters,
} from "@/features/workouts/workoutsSlice";

const CATEGORIES = [
  { id: "all", label: "All Routines" },
  { id: "strength", label: "Strength" },
  { id: "hiit", label: "HIIT" },
  { id: "cardio", label: "Cardio" },
  { id: "mobility", label: "Mobility" },
  { id: "power", label: "Power" },
];

const GOALS = [
  { id: "all", label: "All Goals" },
  { id: "hypertrophy", label: "Hypertrophy" },
  { id: "fat_loss", label: "Fat Loss" },
  { id: "endurance", label: "Endurance" },
  { id: "strength", label: "Max Strength" },
];

const EQUIPMENTS = [
  { id: "all", label: "All Equipment" },
  { id: "bodyweight", label: "Bodyweight" },
  { id: "dumbbell", label: "Dumbbells" },
  { id: "barbell", label: "Barbell" },
  { id: "cables", label: "Cables" },
  { id: "kettlebell", label: "Kettlebell" },
];

const BODY_PARTS = [
  { id: "all", label: "All Muscle Groups" },
  { id: "full_body", label: "Full Body" },
  { id: "chest", label: "Chest" },
  { id: "back", label: "Back" },
  { id: "legs", label: "Legs" },
  { id: "core", label: "Core" },
  { id: "arms", label: "Arms & Shoulders" },
];

const DURATIONS = [
  { id: "all", label: "Any Duration" },
  { id: "short", label: "< 25 mins" },
  { id: "medium", label: "25 – 40 mins" },
  { id: "long", label: "> 40 mins" },
];

const DIFFICULTIES = [
  { id: "all", label: "Any Level" },
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
];

export const WorkoutFilters: React.FC = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((state) => state.workouts.filters);

  // Count active non-default filters
  const activeCount = [
    filters.category !== "all",
    filters.goal !== "all",
    filters.equipment !== "all",
    filters.bodyPart !== "all",
    filters.duration !== "all",
    filters.difficulty !== "all",
    filters.searchQuery.trim() !== "",
  ].filter(Boolean).length;

  return (
    <div className="space-y-4 rounded-xl border border-[#222228] bg-[#111115] p-4 sm:p-5">
      {/* Search Bar & Reset Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#71717A]" />
          <Input
            value={filters.searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            placeholder="Search routines by title, muscle, or movement..."
            className="pl-9 bg-[#14141A] border-[#222228] text-xs focus:border-[#C8FF47]"
          />
        </div>

        {activeCount > 0 && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => dispatch(resetFilters())}
            className="gap-1.5 text-xs text-[#A1A1AA] hover:text-[#C8FF47] shrink-0"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Filters ({activeCount})</span>
          </Button>
        )}
      </div>

      {/* Category Pills (Horizontal Scroll) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => dispatch(setCategoryFilter(cat.id))}
            className={`shrink-0 rounded-lg px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all ${
              filters.category === cat.id
                ? "bg-[#C8FF47] text-[#08080A] shadow-[0_0_10px_rgba(200,255,71,0.3)]"
                : "bg-[#14141A] text-[#A1A1AA] border border-[#222228] hover:border-[#3F3F46] hover:text-white"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Dropdown Filters Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1 border-t border-[#222228]">
        {/* Goal */}
        <div>
          <label className="text-[10px] font-mono font-bold uppercase text-[#71717A]">
            Training Goal
          </label>
          <select
            value={filters.goal}
            onChange={(e) => dispatch(setGoalFilter(e.target.value))}
            className="mt-1 w-full rounded-lg border border-[#222228] bg-[#14141A] px-2.5 py-1.5 text-xs text-white focus:border-[#C8FF47] focus:outline-none"
          >
            {GOALS.map((g) => (
              <option key={g.id} value={g.id} className="bg-[#111115]">
                {g.label}
              </option>
            ))}
          </select>
        </div>

        {/* Equipment */}
        <div>
          <label className="text-[10px] font-mono font-bold uppercase text-[#71717A]">
            Equipment
          </label>
          <select
            value={filters.equipment}
            onChange={(e) => dispatch(setEquipmentFilter(e.target.value))}
            className="mt-1 w-full rounded-lg border border-[#222228] bg-[#14141A] px-2.5 py-1.5 text-xs text-white focus:border-[#C8FF47] focus:outline-none"
          >
            {EQUIPMENTS.map((eq) => (
              <option key={eq.id} value={eq.id} className="bg-[#111115]">
                {eq.label}
              </option>
            ))}
          </select>
        </div>

        {/* Body Part */}
        <div>
          <label className="text-[10px] font-mono font-bold uppercase text-[#71717A]">
            Target Muscle
          </label>
          <select
            value={filters.bodyPart}
            onChange={(e) => dispatch(setBodyPartFilter(e.target.value))}
            className="mt-1 w-full rounded-lg border border-[#222228] bg-[#14141A] px-2.5 py-1.5 text-xs text-white focus:border-[#C8FF47] focus:outline-none"
          >
            {BODY_PARTS.map((bp) => (
              <option key={bp.id} value={bp.id} className="bg-[#111115]">
                {bp.label}
              </option>
            ))}
          </select>
        </div>

        {/* Duration */}
        <div>
          <label className="text-[10px] font-mono font-bold uppercase text-[#71717A]">
            Duration
          </label>
          <select
            value={filters.duration}
            onChange={(e) => dispatch(setDurationFilter(e.target.value))}
            className="mt-1 w-full rounded-lg border border-[#222228] bg-[#14141A] px-2.5 py-1.5 text-xs text-white focus:border-[#C8FF47] focus:outline-none"
          >
            {DURATIONS.map((dur) => (
              <option key={dur.id} value={dur.id} className="bg-[#111115]">
                {dur.label}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty */}
        <div>
          <label className="text-[10px] font-mono font-bold uppercase text-[#71717A]">
            Experience Level
          </label>
          <select
            value={filters.difficulty}
            onChange={(e) => dispatch(setDifficultyFilter(e.target.value))}
            className="mt-1 w-full rounded-lg border border-[#222228] bg-[#14141A] px-2.5 py-1.5 text-xs text-white focus:border-[#C8FF47] focus:outline-none"
          >
            {DIFFICULTIES.map((dif) => (
              <option key={dif.id} value={dif.id} className="bg-[#111115]">
                {dif.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
