import { useState, useEffect } from "react";
import {
  Droplet,
  Moon,
  Dumbbell,
  Footprints,
  Flame,
  Sparkles,
  Plus,
  Minus,
  CheckCircle2,
  Database,
  TrendingUp,
  Trash2,
  X,
  BookOpen,
  Heart,
  Zap,
  Coffee,
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  fetchHabits,
  updateHabitProgressAsync,
  optimisticUpdate,
  addCustomHabitAsync,
  deleteHabitAsync,
} from "@/features/habits/habitsSlice";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Droplet,
  Moon,
  Dumbbell,
  Footprints,
  Flame,
  Sparkles,
  BookOpen,
  Heart,
  Zap,
  Coffee,
};

const COLOR_OPTIONS = [
  "#C8FF47", // Lime
  "#00F0FF", // Cyan
  "#A78BFA", // Purple
  "#FF8438", // Orange
  "#FF453A", // Red
  "#38BDF8", // Sky
  "#34D399", // Emerald
  "#F472B6", // Pink
];

export function HabitsPage() {
  const dispatch = useAppDispatch();
  const { habits = [], loading, source, isSaving } = useAppSelector((state) => state.habits);
  const authUserId = useAppSelector((state) => state.auth.userId);
  const userId = authUserId || "demo-user-1";

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newHabitName, setNewHabitName] = useState("");
  const [newHabitTarget, setNewHabitTarget] = useState("1");
  const [newHabitUnit, setNewHabitUnit] = useState("times");
  const [newHabitColor, setNewHabitColor] = useState(COLOR_OPTIONS[0]);
  const [newHabitIcon, setNewHabitIcon] = useState("Sparkles");
  const [newHabitStep, setNewHabitStep] = useState("1");

  useEffect(() => {
    dispatch(fetchHabits(userId));
  }, [dispatch, userId]);

  const habitList = Array.isArray(habits) ? habits : [];
  const completedCount = habitList.filter((h) => h.current >= h.target).length;
  const totalHabits = habitList.length || 1;
  const completionPercent = Math.round((completedCount / totalHabits) * 100);

  const handleIncrement = (habitId: string, step: number) => {
    dispatch(optimisticUpdate({ habitId, delta: step }));
    dispatch(updateHabitProgressAsync({ userId, habitId, delta: step }));
  };

  const handleDecrement = (habitId: string, step: number) => {
    dispatch(optimisticUpdate({ habitId, delta: -step }));
    dispatch(updateHabitProgressAsync({ userId, habitId, delta: -step }));
  };

  const handleCreateCustomHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    await dispatch(
      addCustomHabitAsync({
        userId,
        name: newHabitName.trim(),
        target: Number(newHabitTarget) || 1,
        unit: newHabitUnit.trim() || "times",
        color: newHabitColor,
        iconKey: newHabitIcon,
        step: Number(newHabitStep) || 1,
        category: "custom",
      })
    );

    setNewHabitName("");
    setNewHabitTarget("1");
    setNewHabitUnit("times");
    setIsAddModalOpen(false);
  };

  const handleDeleteHabit = (habitId: string) => {
    if (confirm("Are you sure you want to delete this habit?")) {
      dispatch(deleteHabitAsync({ habitId, userId }));
    }
  };

  return (
    <PageContainer
      title="Habits"
      description="Build the foundation of your fitness lifestyle"
      badge="Daily Routine"
    >
      {/* Top Banner Card: Today's Habits Progress & Live Atlas Status */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl pointer-events-none" />

        <div className="flex items-center gap-6">
          {/* Donut Progress */}
          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-muted"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-primary transition-all duration-700 ease-out"
                strokeWidth="10"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 * (1 - completionPercent / 100)}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <span className="absolute font-display text-lg font-black text-foreground">
              {completedCount}/{totalHabits}
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-display text-xl font-black uppercase text-foreground tracking-wide">
                Today&apos;s Habits
              </h3>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase border border-primary/30 bg-primary/10 text-primary">
                <Database className="h-2.5 w-2.5" />
                {source === "mongodb" ? "MongoDB Atlas" : "Local Sync"}
              </span>
            </div>

            <p className="text-xs text-muted-foreground mt-1">
              {completedCount} of {totalHabits} completed today • {completionPercent}% consistency
            </p>

            {/* Dots Indicator */}
            <div className="flex items-center gap-1.5 mt-3">
              {habitList.map((h) => (
                <span
                  key={h.habitId}
                  className="h-2 w-2 rounded-full transition-all"
                  style={{
                    backgroundColor: h.current >= h.target ? h.color : "currentColor",
                    opacity: h.current >= h.target ? 1 : 0.2,
                    boxShadow:
                      h.current >= h.target ? `0 0 8px ${h.color}80` : "none",
                  }}
                  title={`${h.name}: ${h.current}/${h.target} ${h.unit}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Action Button: Add Habit */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs uppercase tracking-wider hover:bg-primary/90 transition-colors shadow-md"
          >
            <Plus className="h-4 w-4" />
            Add Habit
          </button>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && habitList.length === 0 && (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-20 rounded-2xl bg-card border border-border animate-pulse"
            />
          ))}
        </div>
      )}

      {/* Habits List Rows */}
      <div className="space-y-3">
        {habitList.map((h) => {
          const Icon = ICON_MAP[h.iconKey] || Sparkles;
          const isDone = h.current >= h.target;
          const progressPercent = Math.min(
            100,
            Math.round((h.current / h.target) * 100)
          );

          return (
            <div
              key={h.habitId}
              className="rounded-2xl border border-border bg-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md hover:border-primary/40 transition-all group"
            >
              {/* Left Side: Icon + Name + Streak */}
              <div className="flex items-center gap-3.5 min-w-[200px]">
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border transition-all"
                  style={{
                    backgroundColor: `${h.color}15`,
                    borderColor: `${h.color}30`,
                    color: h.color,
                  }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-foreground flex items-center gap-1.5">
                    <span>{h.name}</span>
                    {isDone && (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[11px] text-muted-foreground font-mono">
                      {h.current} / {h.target} {h.unit}
                    </span>
                    {h.streak > 0 && (
                      <span className="text-[10px] font-semibold text-amber-500 flex items-center gap-0.5 bg-amber-500/10 px-1.5 py-0.5 rounded">
                        <TrendingUp className="h-2.5 w-2.5" />
                        {h.streak}d streak
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Center: Dynamic Progress Bar */}
              <div className="flex-1 max-w-md mx-auto w-full px-1">
                <div className="flex justify-between text-[10px] text-muted-foreground mb-1 font-mono">
                  <span>Progress</span>
                  <span style={{ color: isDone ? h.color : "inherit" }}>
                    {progressPercent}%
                  </span>
                </div>
                <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${progressPercent}%`,
                      backgroundColor: h.color,
                      boxShadow: `0 0 8px ${h.color}60`,
                    }}
                  />
                </div>
              </div>

              {/* Right Side: Quick Increment / Decrement Controls & Optional Delete */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => handleDecrement(h.habitId, h.step || 1)}
                  disabled={h.current <= 0}
                  className="h-8 w-8 rounded-lg bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 disabled:opacity-40 disabled:hover:bg-muted flex items-center justify-center border border-border transition-colors"
                  title={`Decrease by ${h.step || 1}`}
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => handleIncrement(h.habitId, h.step || 1)}
                  className="h-8 w-8 rounded-lg bg-muted text-foreground hover:bg-muted/80 flex items-center justify-center border border-border transition-colors"
                  style={{
                    color: isDone ? h.color : undefined,
                  }}
                  title={`Increase by ${h.step || 1}`}
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>

                {h.category === "custom" && (
                  <button
                    type="button"
                    onClick={() => handleDeleteHabit(h.habitId)}
                    className="h-8 w-8 rounded-lg bg-muted text-muted-foreground hover:text-destructive hover:bg-destructive/10 flex items-center justify-center border border-border transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete custom habit"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Habit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="font-display text-lg font-black uppercase text-foreground mb-4">
              Add New Habit
            </h3>

            <form onSubmit={handleCreateCustomHabit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                  Habit Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Read 10 Pages, Cold Shower"
                  value={newHabitName}
                  onChange={(e) => setNewHabitName(e.target.value)}
                  className="w-full rounded-xl bg-muted border border-border px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                    Daily Target
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={newHabitTarget}
                    onChange={(e) => setNewHabitTarget(e.target.value)}
                    className="w-full rounded-xl bg-muted border border-border px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., pages, mins"
                    required
                    value={newHabitUnit}
                    onChange={(e) => setNewHabitUnit(e.target.value)}
                    className="w-full rounded-xl bg-muted border border-border px-3.5 py-2.5 text-sm text-foreground focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                  Theme Color
                </label>
                <div className="flex items-center gap-2">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewHabitColor(c)}
                      className={`h-7 w-7 rounded-full border transition-all ${
                        newHabitColor === c
                          ? "scale-110 border-primary ring-2 ring-primary/30 shadow-lg"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
                  Icon
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {Object.entries(ICON_MAP).map(([key, IconComp]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setNewHabitIcon(key)}
                      className={`h-10 rounded-xl border flex items-center justify-center transition-all ${
                        newHabitIcon === key
                          ? "border-primary bg-primary/15 text-primary"
                          : "border-border bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <IconComp className="h-4 w-4" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-muted text-xs font-semibold text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-xs font-bold text-primary-foreground uppercase tracking-wider hover:bg-primary/90"
                >
                  Save Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageContainer>
  );
}
