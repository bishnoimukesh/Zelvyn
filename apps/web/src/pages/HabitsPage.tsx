import { useState } from "react";
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
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";

interface Habit {
  id: string;
  name: string;
  current: number;
  target: number;
  unit: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  step: number;
}

const INITIAL_HABITS: Habit[] = [
  {
    id: "water",
    name: "Water",
    current: 5,
    target: 8,
    unit: "glasses",
    color: "#00F0FF",
    icon: Droplet,
    step: 1,
  },
  {
    id: "sleep",
    name: "Sleep",
    current: 7.5,
    target: 8,
    unit: "hours",
    color: "#A78BFA",
    icon: Moon,
    step: 0.5,
  },
  {
    id: "workout",
    name: "Workout",
    current: 1,
    target: 1,
    unit: "session",
    color: "#C8FF47",
    icon: Dumbbell,
    step: 1,
  },
  {
    id: "steps",
    name: "Steps",
    current: 7842,
    target: 10000,
    unit: "steps",
    color: "#FF8438",
    icon: Footprints,
    step: 500,
  },
  {
    id: "protein",
    name: "Protein",
    current: 145,
    target: 160,
    unit: "g",
    color: "#FF453A",
    icon: Flame,
    step: 10,
  },
  {
    id: "meditation",
    name: "Meditation",
    current: 10,
    target: 10,
    unit: "min",
    color: "#38BDF8",
    icon: Sparkles,
    step: 5,
  },
];

export function HabitsPage() {
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);

  const completedCount = habits.filter((h) => h.current >= h.target).length;
  const totalHabits = habits.length;
  const completionPercent = Math.round((completedCount / totalHabits) * 100);

  const handleIncrement = (id: string) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id ? { ...h, current: Math.min(h.target * 2, h.current + h.step) } : h
      )
    );
  };

  const handleDecrement = (id: string) => {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id ? { ...h, current: Math.max(0, h.current - h.step) } : h
      )
    );
  };

  return (
    <PageContainer
      title="Habits"
      description="Build the foundation of your fitness lifestyle"
      badge="Daily Routine"
    >
      {/* Top Banner Card: Today's Habits Progress */}
      <div className="rounded-2xl border border-[#1E1E24] bg-[#111114] p-6 shadow-lg flex items-center gap-6">
        {/* Donut Progress */}
        <div className="relative flex h-24 w-24 shrink-0 items-center justify-center">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              className="stroke-[#1C1C22]"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              className="stroke-[#C8FF47] transition-all duration-700 ease-out"
              strokeWidth="10"
              strokeDasharray={251.2}
              strokeDashoffset={251.2 * (1 - completionPercent / 100)}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <span className="absolute font-display text-lg font-black text-white">
            {completedCount}/{totalHabits}
          </span>
        </div>

        <div className="min-w-0">
          <h3 className="font-display text-xl font-black uppercase text-white tracking-wide">
            Today&apos;s Habits
          </h3>
          <p className="text-xs text-[#A1A1AA] mt-0.5">
            {completedCount} of {totalHabits} completed
          </p>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5 mt-3">
            {habits.map((h) => (
              <span
                key={h.id}
                className="h-2 w-2 rounded-full transition-all"
                style={{
                  backgroundColor: h.current >= h.target ? h.color : "#27272A",
                  boxShadow:
                    h.current >= h.target
                      ? `0 0 8px ${h.color}80`
                      : "none",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Habits List Rows */}
      <div className="space-y-3">
        {habits.map((h) => {
          const Icon = h.icon;
          const isDone = h.current >= h.target;
          const progressPercent = Math.min(
            100,
            Math.round((h.current / h.target) * 100)
          );

          return (
            <div
              key={h.id}
              className="rounded-2xl border border-[#1E1E24] bg-[#111114] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md hover:border-[#2E2E38] transition-all"
            >
              {/* Left Side: Icon + Name */}
              <div className="flex items-center gap-3.5 min-w-[140px]">
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
                  <div className="text-sm font-bold text-white flex items-center gap-1.5">
                    <span>{h.name}</span>
                    {isDone && (
                      <CheckCircle2 className="h-4 w-4 text-[#C8FF47]" />
                    )}
                  </div>
                  <span className="text-[11px] text-[#71717A] font-mono">
                    {h.current} / {h.target} {h.unit}
                  </span>
                </div>
              </div>

              {/* Center: Dynamic Progress Bar */}
              <div className="flex-1 max-w-md mx-auto w-full px-1">
                <div className="h-2.5 w-full bg-[#18181E] rounded-full overflow-hidden">
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

              {/* Right Side: Quick Increment / Decrement Controls */}
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => handleDecrement(h.id)}
                  className="h-8 w-8 rounded-lg bg-[#18181E] text-[#A1A1AA] hover:text-white hover:bg-[#22222A] flex items-center justify-center border border-[#222228] transition-colors"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => handleIncrement(h.id)}
                  className="h-8 w-8 rounded-lg bg-[#18181E] text-white hover:bg-[#22222A] flex items-center justify-center border border-[#222228] transition-colors"
                  style={{
                    color: isDone ? h.color : "white",
                  }}
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </PageContainer>
  );
}
