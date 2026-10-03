import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Flame, CheckCircle2 } from "lucide-react";
import { useAppSelector } from "@/app/hooks";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload: { day: string; calories: number; duration: number; completed: boolean } }>;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border border-[#222228] bg-[#111115] p-3 shadow-xl backdrop-blur-md">
        <p className="text-xs font-mono font-bold uppercase text-white">
          {data.day}
        </p>
        <div className="mt-1 flex items-center gap-2 text-xs">
          <Flame className="h-3.5 w-3.5 text-[#C8FF47]" />
          <span className="font-display font-black text-[#C8FF47]">
            {data.calories} kcal
          </span>
          <span className="text-[#71717A] font-mono">• {data.duration}m active</span>
        </div>
        <p className="mt-1 text-[10px] text-[#A1A1AA]">
          {data.completed ? "✓ Workout Completed" : "Rest / Recovery"}
        </p>
      </div>
    );
  }
  return null;
};

export const WeeklyActivityChart: React.FC = () => {
  const weeklyData = useAppSelector((state) => state.dashboard.weeklyActivity);
  const totalWeeklyCalories = weeklyData.reduce((acc, curr) => acc + curr.calories, 0);

  return (
    <Card className="border border-[#222228] bg-[#111115] p-5">
      {/* Header */}
      <CardHeader className="p-0 pb-4 flex flex-row items-start justify-between">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#71717A]">
            Activity Volume
          </span>
          <CardTitle className="font-display text-xl sm:text-2xl font-black uppercase text-white mt-0.5">
            Weekly Activity Breakdown
          </CardTitle>
          <p className="text-xs text-[#71717A] mt-0.5">
            Total active burn:{" "}
            <span className="font-mono font-bold text-[#C8FF47]">
              {totalWeeklyCalories.toLocaleString()} kcal
            </span>
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] font-mono text-[#71717A]">
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-sm bg-[#C8FF47]" />
            <span>Today</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2.5 w-2.5 rounded-sm bg-[#222228]" />
            <span>Past / Rest</span>
          </div>
        </div>
      </CardHeader>

      {/* Chart Canvas */}
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyData} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
            <XAxis
              dataKey="day"
              stroke="#71717A"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fontFamily: "JetBrains Mono" }}
            />
            <YAxis
              stroke="#71717A"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 10, fontFamily: "JetBrains Mono" }}
              domain={[0, 800]}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255, 255, 255, 0.03)" }} />
            <Bar dataKey="calories" radius={[6, 6, 2, 2]}>
              {weeklyData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.isToday
                      ? "#C8FF47"
                      : entry.completed
                      ? "#3F3F46"
                      : "#222228"
                  }
                  className="transition-colors hover:opacity-80"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Weekly summary footer badges */}
      <div className="mt-3 flex items-center justify-between border-t border-[#222228] pt-3 text-xs font-mono text-[#A1A1AA]">
        <div className="flex items-center gap-1.5">
          <CheckCircle2 className="h-4 w-4 text-[#C8FF47]" />
          <span>5 of 7 Days Active</span>
        </div>
        <span className="text-[11px] text-[#71717A]">Target: 5 days/wk</span>
      </div>
    </Card>
  );
};
