import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Circle,
  Coffee,
  Dumbbell,
  Flame,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  toggleMonthDayCompletion,
  assignWorkoutToMonthDay,
} from "@/features/planner/plannerSlice";
import { CalendarDayEntry } from "@/types";

export function MonthCalendarView() {
  const dispatch = useAppDispatch();
  const monthDays = useAppSelector((state) => state.planner.monthDays);
  const workouts = useAppSelector((state) => state.workouts.items);
  const [selectedDay, setSelectedDay] = useState<CalendarDayEntry | null>(
    () => monthDays.find((d) => d.isToday) || monthDays[0] || null
  );
  const [isChangingWorkout, setIsChangingWorkout] = useState(false);

  // Month stats
  const totalScheduled = monthDays.filter(
    (d) => d.isCurrentMonth && d.workoutId
  ).length;
  const totalCompleted = monthDays.filter(
    (d) => d.isCurrentMonth && d.completed && d.workoutId
  ).length;
  const totalRestDays = monthDays.filter(
    (d) => d.isCurrentMonth && d.isRestDay
  ).length;
  const adherenceRate =
    totalScheduled > 0 ? Math.round((totalCompleted / totalScheduled) * 100) : 0;

  // Find workout for selected day
  const selectedWorkout = selectedDay?.workoutId
    ? workouts.find((w) => w.id === selectedDay.workoutId)
    : null;

  const handleDayClick = (day: CalendarDayEntry) => {
    setSelectedDay(day);
    setIsChangingWorkout(false);
  };

  const handleToggleCompleted = (dateString: string) => {
    dispatch(toggleMonthDayCompletion(dateString));
    if (selectedDay && selectedDay.dateString === dateString) {
      setSelectedDay({
        ...selectedDay,
        completed: !selectedDay.completed,
      });
    }
  };

  const handleSelectWorkoutForDay = (workoutId: string) => {
    if (selectedDay) {
      dispatch(
        assignWorkoutToMonthDay({
          dateString: selectedDay.dateString,
          workoutId,
        })
      );
      setSelectedDay({
        ...selectedDay,
        workoutId,
        isRestDay: false,
      });
      setIsChangingWorkout(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Month Header & Summary Metric Strip */}
      <div className="rounded-2xl border border-[#222228] bg-[#111114]/90 p-5 backdrop-blur-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#C8FF47]/10 text-[#C8FF47] border border-[#C8FF47]/20">
              <CalendarIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-xl font-black uppercase text-white tracking-wide">
                  September 2026
                </h3>
                <span className="rounded-full bg-[#C8FF47]/15 px-2 py-0.5 text-[10px] font-bold text-[#C8FF47] border border-[#C8FF47]/30">
                  Active Mesocycle
                </span>
              </div>
              <p className="text-xs text-[#A1A1AA]">
                30-day periodized hypertrophy & metabolic conditioning phase
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="rounded-xl border border-[#222228] bg-[#16161A] p-2.5 text-center">
              <div className="text-[10px] uppercase font-bold text-[#71717A]">
                Workouts
              </div>
              <div className="text-base font-black text-white">
                {totalScheduled} <span className="text-xs font-normal text-[#71717A]">planned</span>
              </div>
            </div>

            <div className="rounded-xl border border-[#222228] bg-[#16161A] p-2.5 text-center">
              <div className="text-[10px] uppercase font-bold text-[#71717A]">
                Completed
              </div>
              <div className="text-base font-black text-[#C8FF47]">
                {totalCompleted} <span className="text-xs font-normal text-[#71717A]">sessions</span>
              </div>
            </div>

            <div className="rounded-xl border border-[#222228] bg-[#16161A] p-2.5 text-center">
              <div className="text-[10px] uppercase font-bold text-[#71717A]">
                Rest Days
              </div>
              <div className="text-base font-black text-[#00F0FF]">
                {totalRestDays} <span className="text-xs font-normal text-[#71717A]">days</span>
              </div>
            </div>

            <div className="rounded-xl border border-[#222228] bg-[#16161A] p-2.5 text-center">
              <div className="text-[10px] uppercase font-bold text-[#71717A]">
                Adherence
              </div>
              <div className="text-base font-black text-white">
                {adherenceRate}%
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-1.5 self-end lg:self-center">
            <Button
              variant="outline"
              size="icon"
              disabled
              className="h-8 w-8 rounded-lg bg-[#16161A] border-[#222228] text-[#71717A] opacity-50 cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs font-semibold text-[#A1A1AA] px-2">
              Month 9 of 12
            </span>
            <Button
              variant="outline"
              size="icon"
              disabled
              className="h-8 w-8 rounded-lg bg-[#16161A] border-[#222228] text-[#71717A] opacity-50 cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Calendar Grid (2 cols on xl) */}
        <div className="xl:col-span-2 rounded-2xl border border-[#222228] bg-[#111114] p-4 sm:p-6 shadow-xl">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <div
                key={d}
                className="text-[11px] font-bold uppercase tracking-wider text-[#71717A] py-1.5"
              >
                {d}
              </div>
            ))}
          </div>

          {/* 35 Calendar Cells */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {monthDays.map((day) => {
              const workout = day.workoutId
                ? workouts.find((w) => w.id === day.workoutId)
                : null;
              const isSelected = selectedDay?.dateString === day.dateString;

              return (
                <button
                  key={day.dateString}
                  type="button"
                  onClick={() => handleDayClick(day)}
                  className={`relative min-h-[72px] sm:min-h-[88px] p-1.5 sm:p-2 rounded-xl border text-left flex flex-col justify-between transition-all group ${
                    isSelected
                      ? "border-[#C8FF47] bg-[#C8FF47]/5 shadow-[0_0_15px_rgba(200,255,71,0.15)] ring-1 ring-[#C8FF47]"
                      : day.isToday
                      ? "border-[#00F0FF] bg-[#00F0FF]/5 ring-1 ring-[#00F0FF]/50"
                      : day.isCurrentMonth
                      ? "border-[#222228] bg-[#16161A]/80 hover:border-[#383842] hover:bg-[#1A1A20]"
                      : "border-[#1A1A20] bg-[#0D0D10]/50 opacity-40 hover:opacity-75"
                  }`}
                >
                  {/* Day Header Row: Number + Today indicator */}
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-xs font-bold ${
                        day.isToday
                          ? "h-5 w-5 rounded-full bg-[#00F0FF] text-black flex items-center justify-center font-black"
                          : isSelected
                          ? "text-[#C8FF47]"
                          : day.isCurrentMonth
                          ? "text-white"
                          : "text-[#71717A]"
                      }`}
                    >
                      {day.dayNumber}
                    </span>

                    {day.completed && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#C8FF47] shrink-0" />
                    )}
                  </div>

                  {/* Cell Content: Workout pill or Rest */}
                  <div className="mt-1 w-full overflow-hidden">
                    {workout ? (
                      <div
                        className={`px-1.5 py-0.5 rounded text-[10px] font-semibold truncate border ${
                          day.completed
                            ? "bg-[#C8FF47]/10 text-[#C8FF47] border-[#C8FF47]/20"
                            : "bg-[#1E1E26] text-white border-[#2A2A35]"
                        }`}
                        title={workout.title}
                      >
                        <span className="truncate block font-medium">
                          {workout.title}
                        </span>
                      </div>
                    ) : day.isRestDay ? (
                      <div className="flex items-center gap-1 px-1 py-0.5 rounded text-[9px] font-medium text-[#71717A] bg-[#141418]">
                        <Coffee className="h-2.5 w-2.5 shrink-0 text-[#00F0FF]" />
                        <span className="truncate hidden sm:inline">Rest</span>
                      </div>
                    ) : (
                      <div className="text-[9px] text-[#52525B] italic pl-0.5">
                        Empty
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Inspector & Quick Action Panel */}
        <div className="rounded-2xl border border-[#222228] bg-[#111114] p-5 flex flex-col justify-between shadow-xl">
          {selectedDay ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between border-b border-[#222228] pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-bold text-[#A1A1AA]">
                      {selectedDay.dayName}, {selectedDay.dateString}
                    </span>
                    {selectedDay.isToday && (
                      <span className="rounded-full bg-[#00F0FF]/15 px-2 py-0.5 text-[10px] font-bold text-[#00F0FF] border border-[#00F0FF]/30">
                        Today
                      </span>
                    )}
                  </div>
                  <h4 className="font-display text-lg font-black text-white mt-0.5">
                    {selectedWorkout
                      ? selectedWorkout.title
                      : selectedDay.isRestDay
                      ? "Scheduled Rest & Recovery"
                      : "Open Training Slot"}
                  </h4>
                </div>

                {selectedDay.workoutId && (
                  <button
                    type="button"
                    onClick={() => handleToggleCompleted(selectedDay.dateString)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                      selectedDay.completed
                        ? "bg-[#C8FF47] text-black border-[#C8FF47] shadow-[0_0_12px_rgba(200,255,71,0.3)]"
                        : "bg-[#16161A] text-white border-[#222228] hover:border-[#C8FF47]"
                    }`}
                  >
                    {selectedDay.completed ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Completed</span>
                      </>
                    ) : (
                      <>
                        <Circle className="h-3.5 w-3.5 text-[#71717A]" />
                        <span>Mark Done</span>
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Workout Details or Rest info */}
              {selectedWorkout ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="rounded-md bg-[#1E1E24] px-2 py-1 text-xs font-medium text-white border border-[#2A2A35] capitalize">
                      {selectedWorkout.category}
                    </span>
                    <span className="rounded-md bg-[#1E1E24] px-2 py-1 text-xs font-medium text-[#C8FF47] border border-[#2A2A35]">
                      {selectedWorkout.duration} mins
                    </span>
                    <span className="rounded-md bg-[#1E1E24] px-2 py-1 text-xs font-medium text-[#FF8438] border border-[#2A2A35] flex items-center gap-1">
                      <Flame className="h-3 w-3" /> {selectedWorkout.calories} kcal
                    </span>
                  </div>

                  <p className="text-xs text-[#A1A1AA] leading-relaxed">
                    {selectedWorkout.description ||
                      "Focus on progressive tension and strict form across all sets."}
                  </p>

                  {/* Exercises breakdown */}
                  {selectedWorkout.exercises && selectedWorkout.exercises.length > 0 && (
                    <div className="rounded-xl border border-[#222228] bg-[#16161A] p-3 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-white">
                        <span>Exercise Roster</span>
                        <span className="text-[#A1A1AA]">
                          {selectedWorkout.exercises.length} Exercises
                        </span>
                      </div>

                      <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                        {selectedWorkout.exercises.map((ex, idx) => (
                          <div
                            key={ex.id}
                            className="flex items-center justify-between text-xs text-[#E4E4E7] py-1 border-b border-[#222228]/50 last:border-0"
                          >
                            <span className="truncate max-w-[170px]">
                              {idx + 1}. {ex.name}
                            </span>
                            <span className="text-[11px] font-semibold text-[#A1A1AA]">
                              {ex.sets} sets × {ex.reps}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 flex items-center gap-2">
                    <Link
                      to={`/workouts/${selectedWorkout.id}`}
                      className="flex-1"
                    >
                      <Button className="w-full gap-2 font-bold bg-[#C8FF47] text-black hover:bg-[#b5eb38]">
                        <Dumbbell className="h-4 w-4" /> Start Workout
                        <ExternalLink className="h-3.5 w-3.5 ml-auto" />
                      </Button>
                    </Link>

                    <Button
                      variant="outline"
                      onClick={() => setIsChangingWorkout(!isChangingWorkout)}
                      className="text-xs bg-[#16161A] border-[#222228] text-white hover:border-[#C8FF47]"
                    >
                      Swap
                    </Button>
                  </div>
                </div>
              ) : selectedDay.isRestDay ? (
                <div className="space-y-4 py-3">
                  <div className="rounded-xl border border-[#00F0FF]/20 bg-[#00F0FF]/5 p-4 text-center space-y-2">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#00F0FF]/15 text-[#00F0FF]">
                      <Coffee className="h-5 w-5" />
                    </div>
                    <h5 className="font-display text-sm font-bold text-white">
                      Active Rest & Muscle Recovery
                    </h5>
                    <p className="text-xs text-[#A1A1AA]">
                      Optimal muscle protein synthesis happens during rest. Aim for 8+ hours of sleep, 3L of water, and 15-20 min of light mobility work.
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setIsChangingWorkout(true)}
                    className="w-full text-xs font-semibold bg-[#16161A] border-[#222228] text-white hover:border-[#C8FF47]"
                  >
                    Assign Workout Instead
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 py-6 text-center">
                  <p className="text-xs text-[#71717A]">
                    No routine currently assigned for this date.
                  </p>
                  <Button
                    onClick={() => setIsChangingWorkout(true)}
                    className="gap-2 text-xs font-bold bg-[#C8FF47] text-black hover:bg-[#b5eb38]"
                  >
                    <Sparkles className="h-3.5 w-3.5" /> Assign Routine
                  </Button>
                </div>
              )}

              {/* Workout Selection Drawer/List if Changing */}
              {isChangingWorkout && (
                <div className="mt-3 rounded-xl border border-[#222228] bg-[#16161A] p-3 space-y-2 max-h-56 overflow-y-auto">
                  <div className="text-xs font-bold text-white mb-1">
                    Select Routine to Assign:
                  </div>
                  {workouts.slice(0, 6).map((w) => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => handleSelectWorkoutForDay(w.id)}
                      className="w-full text-left p-2 rounded-lg bg-[#111114] hover:bg-[#1E1E26] border border-[#222228] hover:border-[#C8FF47] transition-all flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-white truncate max-w-[160px]">
                        {w.title}
                      </span>
                      <span className="text-[10px] text-[#C8FF47]">
                        {w.duration}m
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-xs text-[#71717A]">
              Select a day on the calendar to view and manage details.
            </div>
          )}

          {/* Quick Split hint footer */}
          <div className="mt-4 pt-3 border-t border-[#222228] flex items-center justify-between text-[11px] text-[#71717A]">
            <span>Click any day to inspect</span>
            <span className="text-[#C8FF47] font-semibold">Synced with Microcycle</span>
          </div>
        </div>
      </div>
    </div>
  );
}
