import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Flame,
  Footprints,
  Clock,
  HeartPulse,
  Bot,
  ArrowRight,
  Dumbbell,
  Sparkles,
  RefreshCw,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PageContainer } from "@/components/layout/PageContainer";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { WeeklyActivityChart } from "@/components/dashboard/WeeklyActivityChart";
import { TodayWorkoutCard } from "@/components/dashboard/TodayWorkoutCard";
import { HydrationTracker } from "@/components/dashboard/HydrationTracker";
import { GoalProgressWidget } from "@/components/dashboard/GoalProgressWidget";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { fetchDashboardStats } from "@/features/dashboard/dashboardSlice";
import { ROUTES } from "@/constants/routes";

export function DashboardPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.profile);
  const { metrics, loading, isLiveSynced } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats(user?.id || "demo-user-1"));
  }, [dispatch, user?.id]);

  return (
    <PageContainer
      title={`Welcome back, ${user?.name || "Athlete"}`}
      description="Here is your athletic readiness, today's targets, and scheduled routine."
      badge="Active Day"
      action={
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => dispatch(fetchDashboardStats(user?.id || "demo-user-1"))}
            disabled={loading}
            className="gap-1.5 text-xs font-semibold border-[#222228] hover:bg-[#18181D]"
            title="Refresh statistics from MongoDB Atlas"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${
                loading ? "animate-spin text-[#C8FF47]" : "text-[#71717A]"
              }`}
            />
            {loading ? "Syncing..." : "Sync Stats"}
          </Button>

          <Link to={ROUTES.WORKOUTS}>
            <Button
              size="sm"
              className="gap-1.5 font-bold shadow-[0_0_12px_rgba(200,255,71,0.25)]"
            >
              <Dumbbell className="h-4 w-4" /> Start Workout
            </Button>
          </Link>
        </div>
      }
    >
      {/* Live Database Sync Indicator */}
      <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#111116] border border-[#222228] mb-4">
        <div className="flex items-center gap-2">
          <div className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isLiveSynced ? "bg-[#10B981]" : "bg-amber-400"
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isLiveSynced ? "bg-[#10B981]" : "bg-amber-500"
              }`}
            />
          </div>
          <span className="text-xs font-medium text-[#A1A1AA]">
            {isLiveSynced
              ? "Live Activity Metrics • MongoDB Atlas Synchronized"
              : "Connecting to Metrics Database..."}
          </span>
        </div>
        <Badge
          variant="outline"
          className="text-[10px] font-mono border-[#27272A] text-[#10B981] bg-[#10B981]/10 gap-1 py-0.5"
        >
          <Database className="h-3 w-3" />
          {isLiveSynced ? "MongoDB Live" : "Buffering"}
        </Badge>
      </div>

      {/* 4 Primary Daily Activity Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <MetricCard
          title="Active Burn"
          value={metrics.calories.current}
          unit={metrics.calories.unit}
          target={metrics.calories.target}
          icon={Flame}
          subtext="Calculated from logged workout sessions"
        />

        <MetricCard
          title="Daily Steps"
          value={metrics.steps.current}
          unit={metrics.steps.unit}
          target={metrics.steps.target}
          icon={Footprints}
          subtext="~6.2 km walked today"
        />

        <MetricCard
          title="Active Duration"
          value={metrics.activeTime.current}
          unit={metrics.activeTime.unit}
          target={metrics.activeTime.target}
          icon={Clock}
          subtext={`${metrics.activeTime.current} of ${metrics.activeTime.target} mins target`}
        />

        <MetricCard
          title="Recovery Score"
          value={metrics.recovery.score}
          unit="%"
          percentage={metrics.recovery.score}
          icon={HeartPulse}
          subtext="Optimal • Ready for intensity"
        />
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Left Column: Scheduled Routine & Weekly Volume Chart */}
        <div className="lg:col-span-7 space-y-6">
          <TodayWorkoutCard />
          <WeeklyActivityChart />
        </div>

        {/* Right Column: Hydration, Milestones, and AI Coach Tip */}
        <div className="lg:col-span-5 space-y-6">
          <HydrationTracker />
          <GoalProgressWidget />

          {/* AI Coach Quick Tip Card */}
          <Card className="border border-[#222228] bg-gradient-to-br from-[#111115] to-[#14141A] p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#C8FF47]/5 rounded-full blur-2xl pointer-events-none" />
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#C8FF47]/10 text-[#C8FF47] shadow-[0_0_10px_rgba(200,255,71,0.2)]">
                <Bot className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#C8FF47]">
                    AI Coach Adaptive Insight
                  </span>
                  <Sparkles className="h-3 w-3 text-[#C8FF47]" />
                </div>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                  Your upper-body volume frequency is in the sweet spot. You hit your target volume on Chest & Back yesterday. Keep recovery optimal today.
                </p>
                <div className="mt-3">
                  <Link
                    to={ROUTES.COACH}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#C8FF47] hover:underline"
                  >
                    Open AI Training Chat <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
