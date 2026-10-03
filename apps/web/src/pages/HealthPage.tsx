import {
  Watch,
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";

interface HealthMetric {
  id: string;
  label: string;
  value: string | number;
  subValue: string;
  ringValue: number;
  color: string;
}

const HEALTH_METRICS: HealthMetric[] = [
  {
    id: "hr",
    label: "Heart Rate",
    value: 69,
    subValue: "69 bpm",
    ringValue: 69,
    color: "#FF453A",
  },
  {
    id: "steps",
    label: "Steps Today",
    value: "6,450",
    subValue: "6,450",
    ringValue: 64,
    color: "#FF8438",
  },
  {
    id: "sleep",
    label: "Sleep",
    value: "6",
    subValue: "6 hrs",
    ringValue: 75,
    color: "#A78BFA",
  },
  {
    id: "active",
    label: "Active Min",
    value: 36,
    subValue: "36 min",
    ringValue: 80,
    color: "#C8FF47",
  },
  {
    id: "calories",
    label: "Calories",
    value: 484,
    subValue: "484 kcal",
    ringValue: 81,
    color: "#34D399",
  },
  {
    id: "recovery",
    label: "Recovery",
    value: 82,
    subValue: "82 %",
    ringValue: 82,
    color: "#00F0FF",
  },
];

export function HealthPage() {
  return (
    <PageContainer
      title="Health"
      description="Biometrics & wellness tracking"
      badge="Apple Health Synced"
      action={
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#C8FF47]/10 text-[#C8FF47] border border-[#C8FF47]/20 text-xs font-bold">
          <Watch className="h-3.5 w-3.5" />
          <span>Connected</span>
        </div>
      }
    >
      {/* 6 Metric Rings Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {HEALTH_METRICS.map((metric) => (
          <div
            key={metric.id}
            className="rounded-2xl border border-[#1E1E24] bg-[#111114] p-5 flex items-center gap-5 shadow-lg"
          >
            {/* Ring */}
            <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  className="stroke-[#1C1C22]"
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  stroke={metric.color}
                  strokeWidth="8"
                  strokeDasharray={238.76}
                  strokeDashoffset={238.76 * (1 - metric.ringValue / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <span className="absolute font-display text-sm font-black text-white">
                {metric.value}
              </span>
            </div>

            <div>
              <div className="text-xs font-semibold text-[#71717A]">
                {metric.label}
              </div>
              <div className="font-display text-lg font-black text-white mt-0.5">
                {metric.subValue}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* HEART RATE TODAY LINE CHART */}
      <div className="rounded-2xl border border-[#1E1E24] bg-[#111114] p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="font-display text-base font-black uppercase text-white tracking-wider">
            Heart Rate Today
          </h3>

          <div className="flex items-center gap-2">
            <span className="rounded-md bg-[#34D399]/15 text-[#34D399] border border-[#34D399]/30 px-2 py-0.5 text-xs font-bold font-mono">
              62 resting
            </span>
            <span className="rounded-md bg-[#FF453A]/15 text-[#FF453A] border border-[#FF453A]/30 px-2 py-0.5 text-xs font-bold font-mono">
              148 max
            </span>
          </div>
        </div>

        {/* SVG Continuous Curve */}
        <div className="relative h-44 w-full pt-4">
          <svg
            className="h-full w-full overflow-visible"
            viewBox="0 0 700 140"
            preserveAspectRatio="none"
          >
            {/* Grid lines */}
            {[20, 55, 90, 125].map((y, i) => (
              <line
                key={i}
                x1="0"
                y1={y}
                x2="700"
                y2={y}
                stroke="#1A1A22"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
            ))}

            {/* Gradient definition */}
            <defs>
              <linearGradient id="hrGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF453A" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#FF453A" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Filled Area */}
            <path
              d="M 0 100 Q 80 90, 150 92 T 250 95 T 350 110 T 450 115 T 520 70 T 580 90 T 640 120 T 700 110 L 700 140 L 0 140 Z"
              fill="url(#hrGradient)"
            />

            {/* Red Heart Rate Stroke */}
            <path
              d="M 0 100 Q 80 90, 150 92 T 250 95 T 350 110 T 450 115 T 520 70 T 580 90 T 640 120 T 700 110"
              fill="none"
              stroke="#FF453A"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>

          {/* Time Labels */}
          <div className="flex justify-between text-[11px] font-mono text-[#71717A] mt-2 pt-2 border-t border-[#1C1C24]">
            <span>0:00</span>
            <span>4:00</span>
            <span>8:00</span>
            <span>12:00</span>
            <span>16:00</span>
            <span>20:00</span>
          </div>
        </div>
      </div>

      {/* VO2 MAX ESTIMATE GAUGE */}
      <div className="rounded-2xl border border-[#1E1E24] bg-[#111114] p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="font-display text-base font-black uppercase text-white tracking-wider">
            VO2 Max Estimate
          </h3>
          <span className="text-xs text-[#71717A]">For age 28, male</span>
        </div>

        <div className="flex items-baseline gap-3">
          <span className="font-display text-4xl font-black text-[#C8FF47]">
            42
          </span>
          <span className="text-xs text-[#71717A] font-mono">ml/kg/min</span>
          <span className="rounded-md bg-[#C8FF47]/15 text-[#C8FF47] border border-[#C8FF47]/30 px-2 py-0.5 text-xs font-bold">
            Good
          </span>
        </div>

        {/* Multi-segment Gauge */}
        <div className="space-y-1.5 pt-1">
          <div className="grid grid-cols-4 gap-1 h-3 rounded-full overflow-hidden bg-[#181820]">
            <div className="bg-[#EF4444]/60 rounded-l-full" title="Poor" />
            <div className="bg-[#F59E0B]/60" title="Fair" />
            <div
              className="bg-[#C8FF47] relative shadow-[0_0_10px_rgba(200,255,71,0.5)]"
              title="Good"
            />
            <div className="bg-[#10B981]/50 rounded-r-full" title="Excellent" />
          </div>

          <div className="flex justify-between text-[10px] font-mono text-[#71717A]">
            <span>Poor</span>
            <span>Fair</span>
            <span className="text-[#C8FF47] font-bold">Good</span>
            <span>Excellent</span>
          </div>
        </div>

        <p className="text-[11px] text-[#52525B] italic">
          * This is an estimate based on activity inputs. Not a clinical measurement.
        </p>
      </div>
    </PageContainer>
  );
}
