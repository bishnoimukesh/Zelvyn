import { LineChart, ResponsiveContainer, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Card, CardTitle } from "@/components/ui/card";
import { Scale, Flame, Footprints } from "lucide-react";
import { useAppSelector } from "@/app/hooks";

export function ProgressPage() {
  const entries = useAppSelector((state) => state.progress.entries);

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#71717A]">
          Analytics
        </span>
        <h1 className="font-display text-3xl font-black uppercase text-white">
          Progress Tracking
        </h1>
        <p className="text-xs text-[#71717A] mt-1">
          Biometrics, weekly trends, and volume evolution.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#71717A]">Weight Trend</span>
            <p className="font-display text-2xl font-black text-white mt-1">69.9 kg</p>
            <span className="text-[11px] font-bold text-[#C8FF47]">-0.9 kg this week</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-[#C8FF47]/10 flex items-center justify-center text-[#C8FF47]">
            <Scale className="h-5 w-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#71717A]">Total Burned</span>
            <p className="font-display text-2xl font-black text-white mt-1">2,440 kcal</p>
            <span className="text-[11px] font-bold text-[#C8FF47]">Weekly target on track</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-[#C8FF47]/10 flex items-center justify-center text-[#C8FF47]">
            <Flame className="h-5 w-5" />
          </div>
        </Card>

        <Card className="p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#71717A]">Weekly Steps</span>
            <p className="font-display text-2xl font-black text-white mt-1">53,800</p>
            <span className="text-[11px] font-bold text-[#C8FF47]">10.7k daily average</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-[#C8FF47]/10 flex items-center justify-center text-[#C8FF47]">
            <Footprints className="h-5 w-5" />
          </div>
        </Card>
      </div>

      {/* Recharts Chart Demo */}
      <Card className="p-5">
        <CardTitle className="mb-4">Weight Progression (kg)</CardTitle>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={entries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222228" />
              <XAxis dataKey="date" stroke="#71717A" tick={{ fontSize: 12 }} />
              <YAxis domain={["dataMin - 0.5", "dataMax + 0.5"]} stroke="#71717A" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111115",
                  borderColor: "#222228",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#C8FF47"
                strokeWidth={3}
                dot={{ r: 4, fill: "#C8FF47" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
