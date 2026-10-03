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
      className="p-5 border-border bg-card space-y-5 relative overflow-hidden shadow-sm"
    >
      {/* Glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary border border-primary/20 flex items-center justify-center">
            <Activity className="h-4 w-4" />
          </div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">
            Daily Readiness Telemetry
          </h3>
        </div>
        <Badge className="bg-primary text-primary-foreground font-black text-[10px] uppercase font-mono">
          Prime
        </Badge>
      </div>

      {/* Readiness Circular Meter & Score */}
      <div className="p-4 rounded-2xl bg-muted border border-border flex items-center gap-4">
        {/* Readiness Radial Indicator */}
        <div className="relative h-16 w-16 flex items-center justify-center flex-shrink-0">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-border"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="text-primary"
              strokeDasharray="88, 100"
              strokeWidth="3.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <div className="absolute font-mono text-sm font-black text-foreground">
            88%
          </div>
        </div>

        <div>
          <span className="text-[10px] font-mono uppercase text-muted-foreground block font-bold">
            Physiological Readiness
          </span>
          <span className="font-display text-lg font-bold text-foreground block">
            Optimal Training State
          </span>
          <span className="text-xs text-primary font-mono font-semibold">
            Low CNS Fatigue · High Volume Capacity
          </span>
        </div>
      </div>

      {/* Biometric Status Telemetry */}
      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="bg-muted p-2.5 rounded-xl border border-border">
          <span className="text-muted-foreground text-[10px] uppercase block">Bodyweight</span>
          <span className="text-foreground font-bold">{latestWeight} kg</span>
        </div>

        <div className="bg-muted p-2.5 rounded-xl border border-border">
          <span className="text-muted-foreground text-[10px] uppercase block">Streak</span>
          <span className="text-amber-500 font-bold">{streak.current} Days 🔥</span>
        </div>

        <div className="bg-muted p-2.5 rounded-xl border border-border">
          <span className="text-muted-foreground text-[10px] uppercase block">Volume Load</span>
          <span className="text-foreground font-bold">{(totalVolume / 1000).toFixed(1)}k kg</span>
        </div>

        <div className="bg-muted p-2.5 rounded-xl border border-border">
          <span className="text-muted-foreground text-[10px] uppercase block">Recovery</span>
          <span className="text-emerald-500 font-bold">Optimal</span>
        </div>
      </div>

      {/* Sleep & Hydration Checklist */}
      <div className="space-y-2 pt-2 border-t border-border text-xs">
        <div className="flex items-center justify-between p-2 rounded-xl bg-muted border border-border">
          <div className="flex items-center gap-2">
            <Moon className="h-3.5 w-3.5 text-indigo-500" />
            <span className="text-foreground font-medium">Sleep Duration</span>
          </div>
          <span className="text-xs font-mono font-bold text-foreground">7.8 hrs (Deep)</span>
        </div>

        <div className="flex items-center justify-between p-2 rounded-xl bg-muted border border-border">
          <div className="flex items-center gap-2">
            <Droplet className="h-3.5 w-3.5 text-cyan-500" />
            <span className="text-foreground font-medium">Hydration</span>
          </div>
          <span className="text-xs font-mono font-bold text-foreground">2.4L / 3.0L</span>
        </div>

        <div className="flex items-center justify-between p-2 rounded-xl bg-muted border border-border">
          <div className="flex items-center gap-2">
            <Heart className="h-3.5 w-3.5 text-rose-500" />
            <span className="text-foreground font-medium">Resting HR</span>
          </div>
          <span className="text-xs font-mono font-bold text-foreground">52 bpm</span>
        </div>
      </div>

      {/* Recommendation Callout */}
      <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-xs">
        <span className="text-[10px] font-mono uppercase text-primary font-bold block mb-1 flex items-center gap-1">
          <Zap className="h-3 w-3" /> Coach Directive
        </span>
        <p className="text-foreground leading-relaxed">
          High adaptive reserve detected. You are cleared for mechanical tension
          compounds or a high-density HIIT circuit today.
        </p>
      </div>
    </Card>
  );
}
