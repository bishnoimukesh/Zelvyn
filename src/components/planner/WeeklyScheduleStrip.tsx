import React from "react";
import {
  Calendar,
  Clock,
  Flame,
  CheckCircle2,
  Coffee,
  Plus,
  ArrowRightLeft,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  openAssignModal,
  toggleRestDay,
  toggleDayCompletion,
} from "@/features/planner/plannerSlice";

export const WeeklyScheduleStrip: React.FC = () => {
  const dispatch = useAppDispatch();
  const schedule = useAppSelector((state) => state.planner.schedule);
  const workouts = useAppSelector((state) => state.workouts.items);

  const totalWeeklyMinutes = schedule.reduce((acc, d) => {
    if (d.isRestDay || !d.workoutId) return acc;
    const w = workouts.find((item) => item.id === d.workoutId);
    return acc + (w?.duration || 0);
  }, 0);

  const totalWeeklyCalories = schedule.reduce((acc, d) => {
    if (d.isRestDay || !d.workoutId) return acc;
    const w = workouts.find((item) => item.id === d.workoutId);
    return acc + (w?.calories || 0);
  }, 0);

  const activeDaysCount = schedule.filter((d) => !d.isRestDay && d.workoutId).length;

  return (
    <div className="space-y-4">
      {/* Volume Summary Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-[#222228] bg-[#111115] p-4">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#71717A]">
            Weekly Split Target
          </span>
          <h3 className="font-display text-xl font-black uppercase text-white mt-0.5">
            7-Day Microcycle Schedule
          </h3>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-[#C8FF47]" />
            <span className="text-white font-bold">{activeDaysCount} Days Active</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-[#C8FF47]" />
            <span className="text-white font-bold">{totalWeeklyMinutes} mins</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Flame className="h-4 w-4 text-[#C8FF47]" />
            <span className="text-white font-bold">{totalWeeklyCalories.toLocaleString()} kcal</span>
          </div>
        </div>
      </div>

      {/* 7-Day Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
        {schedule.map((day) => {
          const workout = workouts.find((w) => w.id === day.workoutId);

          return (
            <Card
              key={day.day}
              className={`p-3.5 flex flex-col justify-between border transition-all ${
                day.isRestDay
                  ? "border-[#222228] bg-[#0E0E12] opacity-80"
                  : "border-[#222228] bg-[#111115] hover:border-[#C8FF47]/40 shadow-[0_0_12px_rgba(200,255,71,0.05)]"
              }`}
            >
              {/* Day Header */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm font-black uppercase text-white">
                    {day.day}
                  </span>
                  <button
                    type="button"
                    onClick={() => dispatch(toggleDayCompletion(day.day))}
                    aria-label={`Toggle completion for ${day.day}`}
                    className={`h-5 w-5 rounded flex items-center justify-center transition-colors ${
                      day.completed
                        ? "text-[#C8FF47]"
                        : "text-[#3F3F46] hover:text-[#71717A]"
                    }`}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Day Status Tag */}
                <div className="mt-1">
                  {day.isRestDay ? (
                    <span className="inline-flex items-center gap-1 rounded bg-[#1F1F26] px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase text-amber-400">
                      <Coffee className="h-2.5 w-2.5" /> Rest & Recovery
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded bg-[#C8FF47]/10 px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase text-[#C8FF47]">
                      Training Session
                    </span>
                  )}
                </div>

                {/* Assigned Workout Info */}
                <div className="mt-2.5 min-h-[60px]">
                  {day.isRestDay ? (
                    <p className="text-[11px] text-[#71717A] leading-relaxed">
                      {day.notes || "Active mobility, light walks, and glycogen rest."}
                    </p>
                  ) : workout ? (
                    <div>
                      <p className="font-display text-xs font-black uppercase text-white line-clamp-2">
                        {workout.title}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[10px] font-mono text-[#A1A1AA]">
                        <span>{workout.duration}m</span>
                        <span>•</span>
                        <span>{workout.calories} kcal</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-2 text-center text-[10px] text-[#71717A]">
                      <span>No workout set</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-2 border-t border-[#222228] mt-2 flex items-center justify-between gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => dispatch(openAssignModal(day.day))}
                  className="h-6 px-1.5 text-[10px] font-mono text-[#A1A1AA] hover:text-[#C8FF47] gap-1"
                >
                  {workout ? (
                    <>
                      <ArrowRightLeft className="h-2.5 w-2.5" /> Swap
                    </>
                  ) : (
                    <>
                      <Plus className="h-2.5 w-2.5" /> Assign
                    </>
                  )}
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => dispatch(toggleRestDay(day.day))}
                  className="h-6 px-1.5 text-[10px] font-mono text-[#71717A] hover:text-white"
                >
                  {day.isRestDay ? "Train" : "Rest"}
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
