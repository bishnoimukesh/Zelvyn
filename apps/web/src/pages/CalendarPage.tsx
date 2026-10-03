import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Coffee,
  Dumbbell,
  CheckCircle2,
  ExternalLink,
  Flame,
  Clock,
  RefreshCw,
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { fetchPlanner } from "@/features/planner/plannerSlice";
import { fetchWorkouts } from "@/features/workouts/workoutsSlice";

export function CalendarPage() {
  const dispatch = useAppDispatch();
  const schedule = useAppSelector((state) => state.planner.schedule);
  const monthDays = useAppSelector((state) => state.planner.monthDays);
  const isLiveSynced = useAppSelector((state) => state.planner.isLiveSynced);
  const loading = useAppSelector((state) => state.planner.loading);
  const workouts = useAppSelector((state) => state.workouts.items);

  const [selectedDateString, setSelectedDateString] = useState<string>("2026-09-13");

  useEffect(() => {
    dispatch(fetchPlanner("demo-user-1"));
    if (workouts.length === 0) {
      dispatch(fetchWorkouts({}));
    }
  }, [dispatch, workouts.length]);

  // Selected Day from live monthDays
  const selectedDay = monthDays.find((d) => d.dateString === selectedDateString) || monthDays[0];
  const selectedWorkout = selectedDay?.workoutId
    ? workouts.find((w) => w.id === selectedDay.workoutId)
    : null;

  return (
    <PageContainer
      title="Calendar"
      description="Plan and track your training schedule"
      badge={isLiveSynced ? "MongoDB Atlas Synced" : "Schedule Active"}
      action={
        <Button
          size="sm"
          variant="outline"
          onClick={() => dispatch(fetchPlanner("demo-user-1"))}
          disabled={loading}
          className="gap-1.5 text-xs border-[#222228] bg-[#14141A] text-[#A1A1AA] hover:text-white"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-[#C8FF47]" : ""}`} />
          Sync
        </Button>
      }
    >
      {/* THIS WEEK STRIP */}
      <div className="rounded-2xl border border-[#1E1E24] bg-[#111114] p-5 space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="text-xs font-black uppercase text-white tracking-wider">
            This Week's Microcycle
          </div>
          <Link
            to="/planner"
            className="text-xs font-mono font-bold text-[#C8FF47] hover:underline flex items-center gap-1"
          >
            Open 7-Day Planner <ExternalLink className="h-3 w-3" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {schedule.map((item) => {
            const workout = workouts.find((w) => w.id === item.workoutId);
            const title = item.isRestDay
              ? "Rest Day"
              : workout
              ? workout.title
              : "No Workout";

            const statusColor = item.isRestDay
              ? "#00F0FF"
              : item.completed
              ? "#C8FF47"
              : "#FF9F0A";

            return (
              <div
                key={item.day}
                className={`rounded-xl border p-3 flex flex-col items-center justify-center text-center transition-all ${
                  item.day === "Sunday"
                    ? "bg-[#182012] border-[#C8FF47]/40 ring-1 ring-[#C8FF47]/30"
                    : "bg-[#16161A] border-[#222228]"
                }`}
              >
                <div className="text-[11px] uppercase font-bold text-[#A1A1AA]">
                  {item.shortDay}
                </div>

                <div className="mt-2 flex items-center gap-1.5 w-full justify-center">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: statusColor }}
                  />
                  <span className="text-xs font-bold text-white truncate max-w-[90px]">
                    {title}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2-Column Calendar & Day Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Month Calendar Grid (2 cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-[#1E1E24] bg-[#111114] p-5 space-y-4 shadow-lg">
          {/* Calendar Header */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              className="p-1.5 rounded-lg text-[#71717A] hover:bg-[#1A1A22] hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <h3 className="font-display text-sm font-black uppercase text-white tracking-widest">
              September 2026
            </h3>

            <button
              type="button"
              className="p-1.5 rounded-lg text-[#71717A] hover:bg-[#1A1A22] hover:text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-2 text-center text-[11px] font-bold text-[#71717A] py-1">
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
            <span>Su</span>
          </div>

          {/* Days Grid from monthDays */}
          <div className="grid grid-cols-7 gap-2">
            {monthDays.map((cell) => {
              const isSelected = selectedDateString === cell.dateString;
              const cellWorkout = cell.workoutId
                ? workouts.find((w) => w.id === cell.workoutId)
                : null;

              const dotColor = cell.isRestDay
                ? "#00F0FF"
                : cell.completed
                ? "#C8FF47"
                : cellWorkout
                ? "#FF453A"
                : undefined;

              return (
                <button
                  key={cell.dateString}
                  type="button"
                  onClick={() => setSelectedDateString(cell.dateString)}
                  className={`relative h-14 sm:h-16 rounded-xl flex flex-col items-center justify-center transition-all ${
                    !cell.isCurrentMonth ? "opacity-30" : ""
                  } ${
                    isSelected
                      ? "bg-[#C8FF47] text-black font-black shadow-[0_0_15px_rgba(200,255,71,0.3)]"
                      : "bg-[#16161A]/80 hover:bg-[#1C1C24] text-white border border-[#222228]"
                  }`}
                >
                  <span
                    className={`text-xs ${
                      isSelected ? "font-black" : "font-semibold"
                    }`}
                  >
                    {cell.dayNumber}
                  </span>

                  {dotColor && (
                    <span
                      className={`mt-1.5 h-1.5 w-1.5 rounded-full ${
                        isSelected ? "bg-black" : ""
                      }`}
                      style={{
                        backgroundColor: isSelected ? undefined : dotColor,
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Inspector Panel */}
        <div className="rounded-2xl border border-[#1E1E24] bg-[#111114] p-6 flex flex-col justify-between shadow-lg">
          <div>
            <div className="flex items-center justify-between border-b border-[#1E1E24] pb-3">
              <span className="text-xs uppercase font-black tracking-widest text-[#71717A]">
                {selectedDay?.dayName} • {selectedDay?.dateString}
              </span>
              {selectedDay?.completed && (
                <span className="text-[10px] font-mono text-[#C8FF47] flex items-center gap-1 font-bold">
                  <CheckCircle2 className="h-3 w-3" /> Completed
                </span>
              )}
            </div>

            {selectedDay?.isRestDay || !selectedWorkout ? (
              <div className="py-10 text-center space-y-3">
                <div className="text-4xl">😴</div>
                <h4 className="font-display text-lg font-black text-white">
                  Rest & Recovery
                </h4>
                <p className="text-xs text-[#A1A1AA] leading-relaxed max-w-xs mx-auto">
                  {selectedDay?.notes ||
                    "Recovery is critical for hypertrophy and nervous system regeneration. Prioritize hydration and 8+ hours of deep sleep."}
                </p>

                <div className="pt-4 flex items-center justify-center gap-2">
                  <span className="rounded-md bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/20 px-2.5 py-1 text-[11px] font-semibold flex items-center gap-1.5">
                    <Coffee className="h-3.5 w-3.5" /> Sleep & Active Recovery
                  </span>
                </div>

                <div className="pt-2">
                  <Link to="/planner">
                    <Button variant="outline" size="sm" className="text-xs border-[#222228] text-white">
                      Assign Workout in Planner
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="py-6 space-y-4">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedWorkout.thumbnail}
                    alt={selectedWorkout.title}
                    className="h-12 w-14 rounded-xl object-cover shrink-0 border border-[#222228]"
                  />
                  <div>
                    <h4 className="font-display text-base font-black text-white">
                      {selectedWorkout.title}
                    </h4>
                    <span className="text-[11px] text-[#A1A1AA] flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-[#C8FF47]" /> {selectedWorkout.duration} mins
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Flame className="h-3 w-3 text-[#C8FF47]" /> {selectedWorkout.calories} kcal
                      </span>
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-[#222228] bg-[#16161A] p-3 text-xs text-[#A1A1AA] space-y-2">
                  <div className="flex justify-between text-white font-semibold">
                    <span>Status</span>
                    <span className="text-[#C8FF47] flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      {selectedDay.completed ? "Session Completed" : "Scheduled"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Category</span>
                    <span className="text-white capitalize">{selectedWorkout.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Target Goal</span>
                    <span className="text-white capitalize">{selectedWorkout.targetGoal || "Hypertrophy"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Difficulty</span>
                    <span className="text-white capitalize">{selectedWorkout.difficulty}</span>
                  </div>
                </div>

                <Link to={`/workouts/${selectedWorkout.id}`} className="block pt-2">
                  <Button className="w-full gap-2 font-bold bg-[#C8FF47] text-black hover:bg-[#b5eb38]">
                    <Dumbbell className="h-4 w-4" /> Start Workout
                    <ExternalLink className="h-3.5 w-3.5 ml-auto" />
                  </Button>
                </Link>
              </div>
            )}
          </div>

          <div className="border-t border-[#1E1E24] pt-3 text-[11px] text-[#71717A] text-center">
            Click any day to inspect routine details
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
