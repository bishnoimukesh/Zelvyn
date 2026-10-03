import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid,
  Cell,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Flame, Zap, Target } from "lucide-react";
import { useAppSelector } from "@/app/hooks";

export function CalorieExpenditureCard() {
  const { calorieTracker } = useAppSelector((state) => state.progress);
  const data = calorieTracker.weeklyDistribution;

  const totalCalories = data.reduce((acc, curr) => acc + curr.calories, 0);
  const averageDaily = Math.round(totalCalories / data.length);
  const daysOnTarget = data.filter(
    (d) => d.calories >= calorieTracker.dailyTarget
  ).length;
  const onTargetRate = Math.round((daysOnTarget / data.length) * 100);

  return (
    <Card className="p-4 sm:p-6 border-border bg-card" id="calorie-expenditure-card">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-7 w-7 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center">
              <Flame className="h-4 w-4" />
            </div>
            <span className="font-display text-sm font-bold uppercase tracking-wider text-foreground">
              Metabolic Expenditure & Calories
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-display text-3xl font-black text-foreground">
              {totalCalories.toLocaleString()}
              <span className="text-sm font-normal text-muted-foreground ml-1">kcal / wk</span>
            </span>
            <span className="text-xs font-mono text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20 font-bold">
              {onTargetRate}% On Target
            </span>
          </div>
        </div>

        {/* Quick Targets */}
        <div className="flex items-center gap-2 bg-muted/60 p-2 rounded-xl border border-border text-xs font-mono">
          <div>
            <span className="text-muted-foreground text-[10px] uppercase block">Daily Target</span>
            <span className="text-primary font-bold">{calorieTracker.dailyTarget} kcal</span>
          </div>
          <div className="w-px h-6 bg-border" />
          <div>
            <span className="text-muted-foreground text-[10px] uppercase block">Daily Avg</span>
            <span className="text-foreground font-bold">{averageDaily} kcal</span>
          </div>
        </div>
      </div>

      {/* Recharts Bar Chart */}
      <div className="h-56 sm:h-64 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="day"
              stroke="var(--border)"
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              stroke="var(--border)"
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}`}
            />
            <ReferenceLine
              y={calorieTracker.dailyTarget}
              stroke="var(--muted-foreground)"
              strokeDasharray="4 4"
              label={{
                value: `Target ${calorieTracker.dailyTarget}kcal`,
                fill: "var(--muted-foreground)",
                fontSize: 10,
                position: "insideTopRight",
              }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length > 0) {
                  const item = payload[0].payload;
                  const isMet = item.calories >= calorieTracker.dailyTarget;
                  return (
                    <div className="bg-card border border-border p-3 rounded-xl shadow-xl font-mono text-xs">
                      <div className="text-muted-foreground text-[10px] uppercase font-bold">
                        {item.day} · {item.date}
                      </div>
                      <div className="text-foreground text-base font-black mt-0.5">
                        {item.calories} kcal
                      </div>
                      <div
                        className={`text-[10px] font-bold mt-1 ${
                          isMet ? "text-primary" : "text-amber-400"
                        }`}
                      >
                        {isMet
                          ? `✓ Target Met (+${item.calories - calorieTracker.dailyTarget} kcal)`
                          : `Below Target (${item.calories - calorieTracker.dailyTarget} kcal)`}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="calories" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.calories >= calorieTracker.dailyTarget ? "var(--primary)" : "var(--border)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Footer */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-border text-xs font-mono text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <Zap className="h-3.5 w-3.5 text-primary" />
          Active Burn Target: {calorieTracker.dailyTarget} kcal
        </span>
        <span className="flex items-center gap-1.5 text-foreground font-semibold">
          <Target className="h-3.5 w-3.5 text-primary" />
          {daysOnTarget} of 7 Days On Goal
        </span>
      </div>
    </Card>
  );
}
