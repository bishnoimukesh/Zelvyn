import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Zap, Droplet, Moon, Heart } from "lucide-react";
import { useAppSelector } from "@/app/hooks";

export function CoachRecoveryWidget() {
  const { streak, workoutHistory, weightHistory } = useAppSelector(
    (state) => state.progress
  );

  const latestWeight = weightHistory[weightHistory.length - 1]?.weight || 69.9;
  const totalVolume = workoutHistory.reduce(
    (acc, curr) => acc + curr.totalVolumeKg,
    0
  );

  return (
    <Card
      id="coach-recovery-widget"
      className="p-5 border-[#222228] bg-[#121216] space-y-5 relative overflow-hidden"
    >
      {/* Glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-[#C8FF47]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-[#C8FF47]/10 text-[#C8FF47] border border-[#C8FF47]/20 flex items-center justify-center">
            <Activity className="h-4 w-4" />
          </div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
            Daily Readiness Telemetry
          </h3>
        </div>
        <Badge className="bg-[#C8FF47] text-black font-black text-[10px] uppercase font-mono">
          Prime
        </Badge>
      </div>

      {/* Readiness Circular Meter & Score */}
      <div className="p-4 rounded-2xl bg-[#181820] border border-[#222228] flex items-center gap-4">
        {/* Readiness Radial Indicator */}
        <div className="relative h-16 w-16 flex items-center justify-center flex-shrink-0">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-[#252530]"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-[#C8FF47]"
              strokeDasharray="88, 100"
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute font-mono text-sm font-black text-white">
            88%
          </div>
        </div>

        <div>
          <span className="text-[10px] font-mono uppercase text-[#71717A] block font-bold">
            Physiological Readiness
          </span>
          <span className="font-display text-lg font-bold text-white block">
            Optimal Training State
          </span>
          <span className="text-xs text-[#C8FF47] font-mono">
            Low CNS Fatigue · High Volume Capacity
          </span>
        </div>
      </div>

      {/* Biometric Status Telemetry */}
      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="bg-[#181820] p-2.5 rounded-xl border border-[#222228]">
          <span className="text-[#71717A] text-[10px] uppercase block">Bodyweight</span>
          <span className="text-white font-bold">{latestWeight} kg</span>
        </div>

        <div className="bg-[#181820] p-2.5 rounded-xl border border-[#222228]">
          <span className="text-[#71717A] text-[10px] uppercase block">Streak</span>
          <span className="text-[#C8FF47] font-bold">{streak.current} Days 🔥</span>
        </div>

        <div className="bg-[#181820] p-2.5 rounded-xl border border-[#222228]">
          <span className="text-[#71717A] text-[10px] uppercase block">Volume Load</span>
          <span className="text-white font-bold">{(totalVolume / 1000).toFixed(1)}k kg</span>
        </div>

        <div className="bg-[#181820] p-2.5 rounded-xl border border-[#222228]">
          <span className="text-[#71717A] text-[10px] uppercase block">Recovery</span>
          <span className="text-emerald-400 font-bold">Optimal</span>
        </div>
      </div>

      {/* Sleep & Hydration Checklist */}
      <div className="space-y-2 pt-2 border-t border-[#222228] text-xs">
        <div className="flex items-center justify-between p-2 rounded-xl bg-[#181820] border border-[#222228]">
          <div className="flex items-center gap-2">
            <Moon className="h-3.5 w-3.5 text-indigo-400" />
            <span className="text-white font-medium">Sleep Duration</span>
          </div>
          <span className="text-xs font-mono font-bold text-white">7.8 hrs (Deep)</span>
        </div>

        <div className="flex items-center justify-between p-2 rounded-xl bg-[#181820] border border-[#222228]">
          <div className="flex items-center gap-2">
            <Droplet className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-white font-medium">Hydration</span>
          </div>
          <span className="text-xs font-mono font-bold text-white">2.4L / 3.0L</span>
        </div>

        <div className="flex items-center justify-between p-2 rounded-xl bg-[#181820] border border-[#222228]">
          <div className="flex items-center gap-2">
            <Heart className="h-3.5 w-3.5 text-rose-400" />
            <span className="text-white font-medium">Resting HR</span>
          </div>
          <span className="text-xs font-mono font-bold text-white">52 bpm</span>
        </div>
      </div>

      {/* Recommendation Callout */}
      <div className="p-3 rounded-xl bg-[#181C14] border border-[#2A3622] text-xs">
        <span className="text-[10px] font-mono uppercase text-[#C8FF47] font-bold block mb-1 flex items-center gap-1">
          <Zap className="h-3 w-3" /> Coach Directive
        </span>
        <p className="text-[#E4E4E7] leading-relaxed">
          High adaptive reserve detected. You are cleared for mechanical tension
          compounds or a high-density HIIT circuit today.
        </p>
      </div>
    </Card>
  );
}
