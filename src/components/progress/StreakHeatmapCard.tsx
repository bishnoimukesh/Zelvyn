import { useAppSelector } from "@/app/hooks";
import { Card } from "@/components/ui/card";
import { Flame, Trophy, CheckCircle2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export function StreakHeatmapCard() {
  const { streak, activityHeatmap } = useAppSelector((state) => state.progress);

  const daysOfWeek = ["M", "T", "W", "T", "F", "S", "S"];

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case "intense":
        return "bg-[#C8FF47] shadow-[0_0_8px_rgba(200,255,71,0.4)] border-[#C8FF47]";
      case "moderate":
        return "bg-[#7CA822] border-[#7CA822]";
      case "light":
        return "bg-[#3D5215] border-[#3D5215]";
      case "none":
      default:
        return "bg-[#1E1E26] border-[#2A2A36]";
    }
  };

  return (
    <Card className="p-4 sm:p-6 border-[#222228] bg-[#121216] space-y-5" id="streak-heatmap-card">
      {/* Top Streak Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center">
            <Flame className="h-5 w-5 fill-orange-500/20" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-xl font-black text-white">
                {streak.current} Days Active
              </span>
              <span className="text-[10px] font-mono text-[#C8FF47] bg-[#C8FF47]/10 px-2 py-0.5 rounded border border-[#C8FF47]/20 font-bold uppercase">
                Streak On Fire
              </span>
            </div>
            <p className="text-xs text-[#71717A] font-mono">
              All-Time Best: <span className="text-white font-bold">{streak.longest} Days</span>
            </p>
          </div>
        </div>
      </div>

      {/* 28-Day Consistency Matrix */}
      <div className="p-4 rounded-2xl bg-[#181820] border border-[#222228]">
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="font-display font-bold uppercase tracking-wider text-white text-[11px]">
            Activity Heatmap (Last 28 Days)
          </span>
          <span className="text-[10px] font-mono text-[#71717A]">
            Mon – Sun Microcycles
          </span>
        </div>

        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-mono text-[#71717A] mb-1.5 font-bold">
          {daysOfWeek.map((d, i) => (
            <span key={i}>{d}</span>
          ))}
        </div>

        {/* 28-Cell Grid (4 rows of 7) */}
        <div className="grid grid-cols-7 gap-1.5" id="activity-heatmap-grid">
          {activityHeatmap.map((day, idx) => (
            <div
              key={idx}
              title={`${day.date} (${day.dayOfWeek}): ${day.workoutTitle || "Rest"} ${
                day.caloriesBurned ? `· ${day.caloriesBurned} kcal` : ""
              }`}
              className={cn(
                "aspect-square rounded-md border transition-all duration-200 cursor-pointer hover:scale-110",
                getIntensityColor(day.intensity)
              )}
            />
          ))}
        </div>

        {/* Heatmap Legend */}
        <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-[#222228] text-[10px] font-mono text-[#71717A]">
          <span>Rest</span>
          <div className="h-2.5 w-2.5 rounded bg-[#1E1E26] border border-[#2A2A36]" />
          <div className="h-2.5 w-2.5 rounded bg-[#3D5215]" />
          <div className="h-2.5 w-2.5 rounded bg-[#7CA822]" />
          <div className="h-2.5 w-2.5 rounded bg-[#C8FF47]" />
          <span>Intense</span>
        </div>
      </div>

      {/* Milestone Badges */}
      <div>
        <h4 className="font-display text-xs font-bold uppercase tracking-wider text-white mb-2.5 flex items-center gap-1.5">
          <Trophy className="h-3.5 w-3.5 text-[#C8FF47]" /> Streak Milestones & Badges
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {streak.badges.map((badge) => (
            <div
              key={badge.id}
              className={cn(
                "p-2.5 rounded-xl border flex items-center gap-2.5 transition-colors",
                badge.unlocked
                  ? "bg-[#181820] border-[#2A2A36] text-white"
                  : "bg-[#141418] border-[#1F1F26] text-[#52525B] opacity-60"
              )}
            >
              <span className="text-xl">{badge.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold truncate">
                    {badge.title}
                  </span>
                  {badge.unlocked ? (
                    <CheckCircle2 className="h-3 w-3 text-[#C8FF47] flex-shrink-0" />
                  ) : (
                    <Lock className="h-3 w-3 text-[#52525B] flex-shrink-0" />
                  )}
                </div>
                <p className="text-[10px] text-[#71717A] truncate">
                  {badge.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
