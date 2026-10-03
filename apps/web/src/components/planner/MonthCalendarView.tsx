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
  updateMonthDayAsync,
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
    const targetDay = monthDays.find((d) => d.dateString === dateString);
    const nextCompleted = targetDay ? !targetDay.completed : true;

    dispatch(toggleMonthDayCompletion(dateString));
    dispatch(
      updateMonthDayAsync({
        dayData: { dateString, completed: nextCompleted },
      })
    );

    if (selectedDay && selectedDay.dateString === dateString) {
      setSelectedDay({
        ...selectedDay,
        completed: nextCompleted,
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
      dispatch(
        updateMonthDayAsync({
          dayData: {
            dateString: selectedDay.dateString,
            workoutId,
            isRestDay: false,
          },
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
      <div className="rounded-2xl border border-border bg-card p-5 backdrop-blur-md shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
              <CalendarIcon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display text-xl font-black uppercase text-foreground tracking-wide">
                  September 2026
                </h3>
                <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-bold text-primary border border-primary/30">
                  Active Mesocycle
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                30-day periodized hypertrophy & metabolic conditioning phase
              </p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="rounded-xl border border-border bg-muted p-2.5 text-center">
              <div className="text-[10px] uppercase font-bold text-muted-foreground">
                Workouts
              </div>
              <div className="text-base font-black text-foreground">
                {totalScheduled} <span className="text-xs font-normal text-muted-foreground">planned</span>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-muted p-2.5 text-center">
              <div className="text-[10px] uppercase font-bold text-muted-foreground">
                Completed
              </div>
              <div className="text-base font-black text-primary">
                {totalCompleted} <span className="text-xs font-normal text-muted-foreground">sessions</span>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-muted p-2.5 text-center">
              <div className="text-[10px] uppercase font-bold text-muted-foreground">
                Rest Days
              </div>
              <div className="text-base font-black text-cyan-500">
                {totalRestDays} <span className="text-xs font-normal text-muted-foreground">days</span>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-muted p-2.5 text-center">
              <div className="text-[10px] uppercase font-bold text-muted-foreground">
                Adherence
              </div>
              <div className="text-base font-black text-foreground">
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
              className="h-8 w-8 rounded-lg bg-card border-border text-muted-foreground opacity-50 cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs font-semibold text-muted-foreground px-2">
              Month 9 of 12
            </span>
            <Button
              variant="outline"
              size="icon"
              disabled
              className="h-8 w-8 rounded-lg bg-card border-border text-muted-foreground opacity-50 cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Calendar Grid (2 cols on xl) */}
        <div className="xl:col-span-2 rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-sm">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2 text-center">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
              <div
                key={d}
                className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground py-1.5"
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
                      ? "border-primary bg-primary/10 shadow-[0_0_15px_rgba(200,255,71,0.15)] ring-1 ring-primary"
                      : day.isToday
                      ? "border-cyan-500 bg-cyan-500/10 ring-1 ring-cyan-500/50"
                      : day.isCurrentMonth
                      ? "border-border bg-muted/60 hover:border-primary/40 hover:bg-muted"
                      : "border-border/40 bg-muted/20 opacity-40 hover:opacity-75"
                  }`}
                >
                  {/* Day Header Row: Number + Today indicator */}
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`text-xs font-bold ${
                        day.isToday
                          ? "h-5 w-5 rounded-full bg-cyan-500 text-black flex items-center justify-center font-black"
                          : isSelected
                          ? "text-primary font-black"
                          : day.isCurrentMonth
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {day.dayNumber}
                    </span>

                    {day.completed && (
                      <CheckCircle2 className="h-3.5 w-3.5 text-primary shrink-0" />
                    )}
                  </div>

                  {/* Cell Content: Workout pill or Rest */}
                  <div className="mt-1 w-full overflow-hidden">
                    {workout ? (
                      <div
                        className={`px-1.5 py-0.5 rounded text-[10px] font-semibold truncate border ${
                          day.completed
                            ? "bg-primary/15 text-primary border-primary/30"
                            : "bg-card text-foreground border-border"
                        }`}
                        title={workout.title}
                      >
                        <span className="truncate block font-medium">
                          {workout.title}
                        </span>
                      </div>
                    ) : day.isRestDay ? (
                      <div className="flex items-center gap-1 px-1 py-0.5 rounded text-[9px] font-medium text-muted-foreground bg-muted">
                        <Coffee className="h-2.5 w-2.5 shrink-0 text-cyan-500" />
                        <span className="truncate hidden sm:inline">Rest</span>
                      </div>
                    ) : (
                      <div className="text-[9px] text-muted-foreground/60 italic pl-0.5">
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
        <div className="rounded-2xl border border-border bg-card p-5 flex flex-col justify-between shadow-sm">
          {selectedDay ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between border-b border-border pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-bold text-muted-foreground">
                      {selectedDay.dayName}, {selectedDay.dateString}
                    </span>
                    {selectedDay.isToday && (
                      <span className="rounded-full bg-cyan-500/15 px-2 py-0.5 text-[10px] font-bold text-cyan-500 border border-cyan-500/30">
                        Today
                      </span>
                    )}
                  </div>
                  <h4 className="font-display text-lg font-black text-foreground mt-0.5">
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
                        ? "bg-primary text-primary-foreground border-primary shadow-[0_0_12px_rgba(200,255,71,0.3)]"
                        : "bg-muted text-foreground border-border hover:border-primary"
                    }`}
                  >
                    {selectedDay.completed ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Completed</span>
                      </>
                    ) : (
                      <>
                        <Circle className="h-3.5 w-3.5 text-muted-foreground" />
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
                    <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-foreground border border-border capitalize">
                      {selectedWorkout.category}
                    </span>
                    <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-primary border border-border">
                      {selectedWorkout.duration} mins
                    </span>
                    <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium text-amber-500 border border-border flex items-center gap-1">
                      <Flame className="h-3 w-3" /> {selectedWorkout.calories} kcal
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {selectedWorkout.description ||
                      "Focus on progressive tension and strict form across all sets."}
                  </p>

                  {/* Exercises breakdown */}
                  {selectedWorkout.exercises && selectedWorkout.exercises.length > 0 && (
                    <div className="rounded-xl border border-border bg-muted/60 p-3 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-foreground">
                        <span>Exercise Roster</span>
                        <span className="text-muted-foreground">
                          {selectedWorkout.exercises.length} Exercises
                        </span>
                      </div>

                      <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                        {selectedWorkout.exercises.map((ex, idx) => (
                          <div
                            key={ex.id}
                            className="flex items-center justify-between text-xs text-foreground py-1 border-b border-border/50 last:border-0"
                          >
                            <span className="truncate max-w-[170px]">
                              {idx + 1}. {ex.name}
                            </span>
                            <span className="text-[11px] font-semibold text-muted-foreground">
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
                      <Button className="w-full gap-2 font-bold bg-primary text-primary-foreground hover:opacity-95">
                        <Dumbbell className="h-4 w-4" /> Start Workout
                        <ExternalLink className="h-3.5 w-3.5 ml-auto" />
                      </Button>
                    </Link>

                    <Button
                      variant="outline"
                      onClick={() => setIsChangingWorkout(!isChangingWorkout)}
                      className="text-xs bg-card border-border text-foreground hover:border-primary"
                    >
                      Swap
                    </Button>
                  </div>
                </div>
              ) : selectedDay.isRestDay ? (
                <div className="space-y-4 py-3">
                  <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-center space-y-2">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-cyan-500/15 text-cyan-500">
                      <Coffee className="h-5 w-5" />
                    </div>
                    <h5 className="font-display text-sm font-bold text-foreground">
                      Active Rest & Muscle Recovery
                    </h5>
                    <p className="text-xs text-muted-foreground">
                      Optimal muscle protein synthesis happens during rest. Aim for 8+ hours of sleep, 3L of water, and 15-20 min of light mobility work.
                    </p>
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setIsChangingWorkout(true)}
                    className="w-full text-xs font-semibold bg-card border-border text-foreground hover:border-primary"
                  >
                    Assign Workout Instead
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 py-6 text-center">
                  <p className="text-xs text-muted-foreground">
                    No routine currently assigned for this date.
                  </p>
                  <Button
                    onClick={() => setIsChangingWorkout(true)}
                    className="gap-2 text-xs font-bold bg-primary text-primary-foreground hover:opacity-95"
                  >
                    <Sparkles className="h-3.5 w-3.5" /> Assign Routine
                  </Button>
                </div>
              )}

              {/* Workout Selection Drawer/List if Changing */}
              {isChangingWorkout && (
                <div className="mt-3 rounded-xl border border-border bg-muted p-3 space-y-2 max-h-56 overflow-y-auto">
                  <div className="text-xs font-bold text-foreground mb-1">
                    Select Routine to Assign:
                  </div>
                  {workouts.slice(0, 6).map((w) => (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => handleSelectWorkoutForDay(w.id)}
                      className="w-full text-left p-2 rounded-lg bg-card hover:bg-muted border border-border hover:border-primary transition-all flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-foreground truncate max-w-[160px]">
                        {w.title}
                      </span>
                      <span className="text-[10px] text-primary font-bold">
                        {w.duration}m
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 text-xs text-muted-foreground">
              Select a day on the calendar to view and manage details.
            </div>
          )}

          {/* Quick Split hint footer */}
          <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Click any day to inspect</span>
            <span className="text-primary font-semibold">Synced with Microcycle</span>
          </div>
        </div>
      </div>
    </div>
  );
}
