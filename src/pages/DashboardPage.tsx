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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageContainer } from "@/components/layout/PageContainer";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { WeeklyActivityChart } from "@/components/dashboard/WeeklyActivityChart";
import { TodayWorkoutCard } from "@/components/dashboard/TodayWorkoutCard";
import { HydrationTracker } from "@/components/dashboard/HydrationTracker";
import { GoalProgressWidget } from "@/components/dashboard/GoalProgressWidget";
import { useAppSelector } from "@/app/hooks";
import { ROUTES } from "@/constants/routes";

export function DashboardPage() {
  const user = useAppSelector((state) => state.user.profile);
  const metrics = useAppSelector((state) => state.dashboard.metrics);

  return (
    <PageContainer
      title={`Welcome back, ${user?.name || "Athlete"}`}
      description="Here is your athletic readiness, today's targets, and scheduled routine."
      badge="Active Day"
      action={
        <div className="flex items-center gap-2">
          <Link to={ROUTES.WORKOUTS}>
            <Button size="sm" className="gap-1.5 font-bold shadow-[0_0_12px_rgba(200,255,71,0.25)]">
              <Dumbbell className="h-4 w-4" /> Start Workout
            </Button>
          </Link>
        </div>
      }
    >
      {/* 4 Primary Daily Activity Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <MetricCard
          title="Active Burn"
          value={metrics.calories.current}
          unit={metrics.calories.unit}
          target={metrics.calories.target}
          icon={Flame}
          subtext="+14% vs 7-day average"
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
          subtext="48 of 60 mins target"
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
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
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
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#C8FF47]">
                  <Sparkles className="h-3 w-3" />
                  <span>AI Coach Recommendation</span>
                </div>
                <h4 className="text-sm font-bold text-white">
                  Post-Workout Glycogen Replenishment
                </h4>
                <p className="text-xs text-[#A1A1AA] leading-relaxed pt-1">
                  Based on today's chest & back volume, aim for 35g protein within 45 minutes to maximize myofibrillar protein synthesis.
                </p>
                <div className="pt-2">
                  <Link to={ROUTES.COACH}>
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs font-bold text-[#C8FF47] hover:text-white hover:bg-[#C8FF47]/10 gap-1 p-0">
                      Ask Coach Follow-up <ArrowRight className="h-3 w-3" />
                    </Button>
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
