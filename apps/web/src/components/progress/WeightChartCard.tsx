import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Scale, Plus, TrendingDown, Target, Award } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { setTimeframeFilter } from "@/features/progress/progressSlice";
import { cn } from "@/lib/utils";

interface WeightChartCardProps {
  onOpenLogModal: () => void;
}

export function WeightChartCard({ onOpenLogModal }: WeightChartCardProps) {
  const dispatch = useAppDispatch();
  const { weightHistory, weightTarget, weightStarting, selectedTimeframe } =
    useAppSelector((state) => state.progress);

  // Filter data based on selectedTimeframe
  const filteredData = (() => {
    switch (selectedTimeframe) {
      case "7D":
        return weightHistory.slice(-7);
      case "30D":
        return weightHistory.slice(-10);
      case "90D":
      case "ALL":
      default:
        return weightHistory;
    }
  })();

  const latestEntry = weightHistory[weightHistory.length - 1];
  const currentWeight = latestEntry ? latestEntry.weight : 69.9;
  const totalLoss = (weightStarting - currentWeight).toFixed(1);
  const remainingToGoal = Math.max(0, currentWeight - weightTarget).toFixed(1);

  const timeframes: ("7D" | "30D" | "90D" | "ALL")[] = ["7D", "30D", "90D", "ALL"];

  return (
    <Card className="p-4 sm:p-6 border-border bg-card relative overflow-hidden" id="weight-chart-card">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-7 w-7 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center">
              <Scale className="h-4 w-4" />
            </div>
            <span className="font-display text-sm font-bold uppercase tracking-wider text-foreground">
              Weight Progression & Biometrics
            </span>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-display text-3xl sm:text-4xl font-black text-foreground">
              {currentWeight} <span className="text-base font-normal text-muted-foreground">kg</span>
            </span>
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1">
              <TrendingDown className="h-3 w-3" /> -{totalLoss} kg Total
            </Badge>
            {latestEntry?.bodyFatPercent && (
              <span className="text-xs font-mono text-muted-foreground bg-muted px-2.5 py-1 rounded-md border border-border">
                {latestEntry.bodyFatPercent}% BF
              </span>
            )}
          </div>
        </div>

        {/* Action Controls: Timeframe buttons & Log button */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-muted p-1 rounded-xl border border-border">
            {timeframes.map((tf) => (
              <button
                key={tf}
                id={`timeframe-btn-${tf}`}
                type="button"
                onClick={() => dispatch(setTimeframeFilter(tf))}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all",
                  selectedTimeframe === tf
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tf}
              </button>
            ))}
          </div>

          <Button
            id="open-log-weight-btn"
            size="sm"
            onClick={onOpenLogModal}
            className="bg-primary text-primary-foreground font-black uppercase text-xs hover:bg-primary/90 shadow-[0_0_15px_rgba(200,255,71,0.25)] flex items-center gap-1.5"
          >
            <Plus className="h-3.5 w-3.5 stroke-[3]" /> Log Weight
          </Button>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={filteredData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="weightGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.35} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="date"
              stroke="var(--border)"
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={["dataMin - 1", "dataMax + 1"]}
              stroke="var(--border)"
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}kg`}
            />

            <ReferenceLine
              y={weightTarget}
              stroke="var(--muted-foreground)"
              strokeDasharray="4 4"
              label={{
                value: `Goal ${weightTarget}kg`,
                fill: "var(--muted-foreground)",
                fontSize: 10,
                position: "insideTopRight",
              }}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length > 0) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-card border border-primary/40 p-3 rounded-xl shadow-xl font-mono text-xs">
                      <div className="text-muted-foreground text-[10px] uppercase font-bold">
                        {data.date}
                      </div>
                      <div className="text-foreground text-base font-black mt-0.5">
                        {data.weight} kg
                      </div>
                      {data.bodyFatPercent && (
                        <div className="text-primary text-[11px] font-semibold mt-0.5">
                          {data.bodyFatPercent}% Body Fat
                        </div>
                      )}
                      {data.notes && (
                        <div className="text-muted-foreground text-[10px] mt-1 border-t border-border pt-1">
                          "{data.notes}"
                        </div>
                      )}
                    </div>
                  );
                }
                return null;
              }}
            />

            <Area
              type="monotone"
              dataKey="weight"
              stroke="var(--primary)"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#weightGlow)"
              dot={{ r: 4, fill: "var(--card)", stroke: "var(--primary)", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "var(--primary)", stroke: "var(--background)", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Target Progress & Biometrics Stats Footer */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-4 border-t border-border text-xs font-mono">
        <div className="bg-muted/60 p-2.5 rounded-xl border border-border">
          <span className="text-muted-foreground text-[10px] uppercase block">Starting</span>
          <span className="text-foreground font-bold">{weightStarting} kg</span>
        </div>

        <div className="bg-muted/60 p-2.5 rounded-xl border border-border">
          <span className="text-muted-foreground text-[10px] uppercase block flex items-center gap-1">
            <Target className="h-3 w-3 text-primary" /> Target Goal
          </span>
          <span className="text-primary font-bold">{weightTarget} kg</span>
        </div>

        <div className="bg-muted/60 p-2.5 rounded-xl border border-border">
          <span className="text-muted-foreground text-[10px] uppercase block">To Target</span>
          <span className="text-foreground font-bold">{remainingToGoal} kg left</span>
        </div>

        <div className="bg-muted/60 p-2.5 rounded-xl border border-border">
          <span className="text-muted-foreground text-[10px] uppercase block flex items-center gap-1">
            <Award className="h-3 w-3 text-emerald-400" /> Velocity
          </span>
          <span className="text-emerald-400 font-bold">-0.45 kg / wk</span>
        </div>
      </div>
    </Card>
  );
}
