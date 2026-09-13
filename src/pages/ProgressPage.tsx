import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Card } from "@/components/ui/card";
import { Scale, Flame, Dumbbell, Trophy } from "lucide-react";
import { useAppSelector } from "@/app/hooks";
import { WeightChartCard } from "@/components/progress/WeightChartCard";
import { LogWeightModal } from "@/components/progress/LogWeightModal";
import { WorkoutHistoryList } from "@/components/progress/WorkoutHistoryList";
import { StreakHeatmapCard } from "@/components/progress/StreakHeatmapCard";
import { CalorieExpenditureCard } from "@/components/progress/CalorieExpenditureCard";
import { StepGoalCard } from "@/components/progress/StepGoalCard";

export function ProgressPage() {
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);

  const { weightHistory, weightTarget, weightStarting, streak, workoutHistory, calorieTracker } =
    useAppSelector((state) => state.progress);

  const latestWeight = weightHistory[weightHistory.length - 1]?.weight || 69.9;
  const totalWeightLoss = (weightStarting - latestWeight).toFixed(1);

  const totalWeeklyCalories = calorieTracker.weeklyDistribution.reduce(
    (acc, curr) => acc + curr.calories,
    0
  );

  const totalWeeklyVolume = workoutHistory.reduce(
    (acc, curr) => acc + curr.totalVolumeKg,
    0
  );

  return (
    <PageContainer
      title="Progress & Athletic Biometrics"
      description="Holistic tracking of progressive overload, body composition evolution, metabolic burn, and streak consistency."
      badge="Analytics Engine"
    >
      {/* Top Quick Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6" id="progress-stats-summary">
        {/* Metric 1: Current Weight */}
        <Card className="p-4 border-[#222228] bg-[#121216] flex items-center justify-between hover:border-[#C8FF47]/40 transition-colors">
          <div>
            <span className="text-[11px] font-mono uppercase text-[#71717A] font-bold">
              Current Weight
            </span>
            <p className="font-display text-2xl sm:text-3xl font-black text-white mt-0.5">
              {latestWeight} <span className="text-sm font-normal text-[#71717A]">kg</span>
            </p>
            <span className="text-[11px] font-mono font-bold text-emerald-400">
              -{totalWeightLoss} kg from start ({weightTarget}kg goal)
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-[#C8FF47]/10 flex items-center justify-center text-[#C8FF47] flex-shrink-0">
            <Scale className="h-5 w-5" />
          </div>
        </Card>

        {/* Metric 2: Weekly Calories */}
        <Card className="p-4 border-[#222228] bg-[#121216] flex items-center justify-between hover:border-[#C8FF47]/40 transition-colors">
          <div>
            <span className="text-[11px] font-mono uppercase text-[#71717A] font-bold">
              Weekly Burn
            </span>
            <p className="font-display text-2xl sm:text-3xl font-black text-white mt-0.5">
              {totalWeeklyCalories.toLocaleString()}{" "}
              <span className="text-sm font-normal text-[#71717A]">kcal</span>
            </p>
            <span className="text-[11px] font-mono font-bold text-[#C8FF47]">
              {Math.round(totalWeeklyCalories / 7)} kcal daily average
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 flex-shrink-0">
            <Flame className="h-5 w-5" />
          </div>
        </Card>

        {/* Metric 3: Total Lifted Volume */}
        <Card className="p-4 border-[#222228] bg-[#121216] flex items-center justify-between hover:border-[#C8FF47]/40 transition-colors">
          <div>
            <span className="text-[11px] font-mono uppercase text-[#71717A] font-bold">
              Total Volume
            </span>
            <p className="font-display text-2xl sm:text-3xl font-black text-white mt-0.5">
              {totalWeeklyVolume > 0
                ? `${(totalWeeklyVolume / 1000).toFixed(1)}k`
                : "0"}{" "}
              <span className="text-sm font-normal text-[#71717A]">kg</span>
            </p>
            <span className="text-[11px] font-mono font-bold text-white">
              {workoutHistory.length} completed sessions
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-[#C8FF47]/10 flex items-center justify-center text-[#C8FF47] flex-shrink-0">
            <Dumbbell className="h-5 w-5" />
          </div>
        </Card>

        {/* Metric 4: Streak */}
        <Card className="p-4 border-[#222228] bg-[#121216] flex items-center justify-between hover:border-[#C8FF47]/40 transition-colors">
          <div>
            <span className="text-[11px] font-mono uppercase text-[#71717A] font-bold">
              Active Streak
            </span>
            <p className="font-display text-2xl sm:text-3xl font-black text-white mt-0.5">
              {streak.current}{" "}
              <span className="text-sm font-normal text-[#71717A]">Days</span>
            </p>
            <span className="text-[11px] font-mono font-bold text-amber-400">
              Personal Record: {streak.longest} Days
            </span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 flex-shrink-0">
            <Trophy className="h-5 w-5" />
          </div>
        </Card>
      </div>

      {/* Main 2-Column Responsive Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols wide on desktop) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Weight Progression Chart */}
          <WeightChartCard onOpenLogModal={() => setIsLogModalOpen(true)} />

          {/* Calorie Expenditure Chart */}
          <CalorieExpenditureCard />

          {/* Workout History Roster */}
          <WorkoutHistoryList />
        </div>

        {/* Right Column (1 Col wide on desktop) */}
        <div className="space-y-6">
          {/* 28-Day Heatmap & Badges */}
          <StreakHeatmapCard />

          {/* Step Goal & NEAT Activity */}
          <StepGoalCard />
        </div>
      </div>

      {/* Interactive Log Weight Modal */}
      <LogWeightModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
      />
    </PageContainer>
  );
}
