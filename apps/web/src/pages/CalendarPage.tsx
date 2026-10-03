import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Coffee,
  Dumbbell,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";

interface DayPreview {
  dayName: string;
  workoutName: string;
  statusColor: string;
  isRest: boolean;
}

const THIS_WEEK: DayPreview[] = [
  { dayName: "Mon", workoutName: "Push Day", statusColor: "#C8FF47", isRest: false },
  { dayName: "Tue", workoutName: "Pull Day", statusColor: "#C8FF47", isRest: false },
  { dayName: "Wed", workoutName: "Rest", statusColor: "#00F0FF", isRest: true },
  { dayName: "Thu", workoutName: "Lower Body", statusColor: "#C8FF47", isRest: false },
  { dayName: "Fri", workoutName: "Full Body HIIT", statusColor: "#FF453A", isRest: false },
  { dayName: "Sat", workoutName: "Mobility", statusColor: "#00F0FF", isRest: false },
  { dayName: "Sun", workoutName: "Rest", statusColor: "#00F0FF", isRest: true },
];

interface MonthDay {
  dayNumber: number;
  dotColor?: string;
  workoutTitle?: string;
  isRest?: boolean;
}

const SEPTEMBER_DAYS: (MonthDay | null)[] = [
  // Sep 1 starts on Tuesday (Su = null, Mo = null)
  null,
  null,
  { dayNumber: 1, dotColor: "#C8FF47", workoutTitle: "Push Day" },
  { dayNumber: 2, dotColor: "#C8FF47", workoutTitle: "Pull Day" },
  { dayNumber: 3, dotColor: "#C8FF47", workoutTitle: "Rest Day", isRest: true },
  { dayNumber: 4, dotColor: "#C8FF47", workoutTitle: "Lower Body Power" },
  { dayNumber: 5, dotColor: "#C8FF47", workoutTitle: "Active Recovery", isRest: true },
  { dayNumber: 6, dotColor: "#00F0FF", workoutTitle: "Core Mobility" },
  { dayNumber: 7, dotColor: "#FF453A", workoutTitle: "Full Body HIIT" },
  { dayNumber: 8, dotColor: "#C8FF47", workoutTitle: "Upper Body Hypertrophy" },
  { dayNumber: 9, dotColor: "#C8FF47", workoutTitle: "Rest & Hydration", isRest: true },
  { dayNumber: 10, dotColor: "#C8FF47", workoutTitle: "Squat & Posterior Chain" },
  { dayNumber: 11, dotColor: "#C8FF47", workoutTitle: "Shoulders & Arms" },
  { dayNumber: 12, dotColor: "#FF453A", workoutTitle: "Metabolic Conditioning" },
  { dayNumber: 13, dotColor: "#C8FF47", workoutTitle: "Rest Day", isRest: true },
  { dayNumber: 14, dotColor: "#C8FF47", workoutTitle: "Chest & Triceps Push" },
  { dayNumber: 15, dotColor: "#C8FF47", workoutTitle: "Back & Core Pull" },
  { dayNumber: 16, dotColor: "#00F0FF", workoutTitle: "Active Walk & Foam Roll", isRest: true },
  { dayNumber: 17, dotColor: "#FF453A", workoutTitle: "Lower Body Compound" },
  { dayNumber: 18, dotColor: "#C8FF47", workoutTitle: "High-Volume Upper" },
  { dayNumber: 19, dotColor: "#C8FF47", workoutTitle: "Kettlebell Power" },
  { dayNumber: 20, dotColor: "#00F0FF", workoutTitle: "Rest & Recovery", isRest: true },
  { dayNumber: 21, dotColor: "#C8FF47", workoutTitle: "Push Day Repeat" },
  { dayNumber: 22, dotColor: "#FF453A", workoutTitle: "Sprint Intervals" },
  { dayNumber: 23, dotColor: "#00F0FF", workoutTitle: "Joint Mobility", isRest: true },
  { dayNumber: 24, dotColor: "#C8FF47", workoutTitle: "Leg Hypertrophy" },
  { dayNumber: 25, dotColor: "#C8FF47", workoutTitle: "Upper Body Density" },
  { dayNumber: 26, dotColor: "#C8FF47", workoutTitle: "Full Body Compound" },
  { dayNumber: 27, dotColor: "#00F0FF", workoutTitle: "Rest Day", isRest: true },
  { dayNumber: 28, dotColor: "#C8FF47", workoutTitle: "Chest & Back" },
  { dayNumber: 29, dotColor: "#C8FF47", workoutTitle: "Quads & Glutes" },
  { dayNumber: 30, dotColor: "#FF453A", workoutTitle: "Tabata HIIT" },
];

export function CalendarPage() {
  const [selectedDayNumber, setSelectedDayNumber] = useState(13);

  const selectedDay = SEPTEMBER_DAYS.find(
    (d) => d && d.dayNumber === selectedDayNumber
  );

  return (
    <PageContainer
      title="Calendar"
      description="Plan and track your training schedule"
      badge="Schedule Active"
    >
      {/* THIS WEEK STRIP */}
      <div className="rounded-2xl border border-[#1E1E24] bg-[#111114] p-5 space-y-3 shadow-lg">
        <div className="text-xs font-black uppercase text-white tracking-wider">
          This Week
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {THIS_WEEK.map((item, idx) => (
            <div
              key={idx}
              className={`rounded-xl border p-3 flex flex-col items-center justify-center text-center transition-all ${
                item.dayName === "Sun"
                  ? "bg-[#182012] border-[#C8FF47]/40 ring-1 ring-[#C8FF47]/30"
                  : "bg-[#16161A] border-[#222228]"
              }`}
            >
              <div className="text-[11px] uppercase font-bold text-[#A1A1AA]">
                {item.dayName}
              </div>

              <div className="mt-2 flex items-center gap-1.5">
                <span
                  className="h-2 w-2 rounded-full shrink-0"
                  style={{ backgroundColor: item.statusColor }}
                />
                <span className="text-xs font-bold text-white truncate max-w-[90px]">
                  {item.workoutName}
                </span>
              </div>
            </div>
          ))}
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
            <span>Su</span>
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-2">
            {SEPTEMBER_DAYS.map((cell, idx) => {
              if (!cell) {
                return <div key={idx} className="h-14 sm:h-16" />;
              }

              const isSelected = selectedDayNumber === cell.dayNumber;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedDayNumber(cell.dayNumber)}
                  className={`relative h-14 sm:h-16 rounded-xl flex flex-col items-center justify-center transition-all ${
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

                  {cell.dotColor && (
                    <span
                      className={`mt-1.5 h-1.5 w-1.5 rounded-full ${
                        isSelected ? "bg-black" : ""
                      }`}
                      style={{
                        backgroundColor: isSelected ? undefined : cell.dotColor,
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
            <div className="text-xs uppercase font-black tracking-widest text-[#71717A] border-b border-[#1E1E24] pb-3">
              Sep {selectedDayNumber}
            </div>

            {selectedDay?.isRest ? (
              <div className="py-12 text-center space-y-3">
                <div className="text-4xl">😴</div>
                <h4 className="font-display text-lg font-black text-white">
                  Rest Day
                </h4>
                <p className="text-xs text-[#A1A1AA] leading-relaxed max-w-xs mx-auto">
                  Recovery is part of the plan. Focus on hydration, 8+ hours of
                  restorative sleep, and light active mobility.
                </p>

                <div className="pt-4 flex items-center justify-center gap-2">
                  <span className="rounded-md bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/20 px-2.5 py-1 text-[11px] font-semibold flex items-center gap-1.5">
                    <Coffee className="h-3.5 w-3.5" /> Sleep & Recovery
                  </span>
                </div>
              </div>
            ) : (
              <div className="py-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-[#C8FF47]/10 flex items-center justify-center text-[#C8FF47] border border-[#C8FF47]/20">
                    <Dumbbell className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-display text-base font-black text-white">
                      {selectedDay?.workoutTitle || "Scheduled Workout"}
                    </h4>
                    <span className="text-[11px] text-[#A1A1AA]">
                      45 mins · 420 kcal
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-[#222228] bg-[#16161A] p-3 text-xs text-[#A1A1AA] space-y-2">
                  <div className="flex justify-between text-white font-semibold">
                    <span>Status</span>
                    <span className="text-[#C8FF47] flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Scheduled
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Intensity</span>
                    <span className="text-white">High Hypertrophy</span>
                  </div>
                </div>

                <Link to="/workouts" className="block pt-2">
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
