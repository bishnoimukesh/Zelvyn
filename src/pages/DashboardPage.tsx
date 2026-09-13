import { Flame, Footprints, Clock, Dumbbell, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useAppSelector } from "@/app/hooks";
import { PageContainer } from "@/components/layout/PageContainer";

export function DashboardPage() {
  const user = useAppSelector((state) => state.user.profile);

  return (
    <PageContainer
      title={`Welcome, ${user?.name || "Athlete"}`}
      description="Track today's targets, athletic metrics, and AI recommendations."
      badge="Phase 2: Shell Ready"
      action={
        <Link to={ROUTES.WORKOUTS}>
          <Button size="sm" className="gap-1 font-bold">
            <Dumbbell className="h-4 w-4" /> Start Workout
          </Button>
        </Link>
      }
    >
      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="hover:border-[#C8FF47]/40 transition-colors">
          <CardHeader className="p-4 pb-1 flex flex-row items-center justify-between">
            <span className="text-xs font-semibold text-[#71717A]">Calories</span>
            <Flame className="h-4 w-4 text-[#C8FF47]" />
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <span className="font-display text-2xl font-black text-white">520</span>
            <span className="text-xs text-[#71717A] ml-1 font-mono">kcal</span>
            <Progress value={65} className="mt-3" />
          </CardContent>
        </Card>

        <Card className="hover:border-[#C8FF47]/40 transition-colors">
          <CardHeader className="p-4 pb-1 flex flex-row items-center justify-between">
            <span className="text-xs font-semibold text-[#71717A]">Steps</span>
            <Footprints className="h-4 w-4 text-[#C8FF47]" />
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <span className="font-display text-2xl font-black text-white">8,420</span>
            <span className="text-xs text-[#71717A] ml-1 font-mono">/ 10k</span>
            <Progress value={84} className="mt-3" />
          </CardContent>
        </Card>

        <Card className="hover:border-[#C8FF47]/40 transition-colors">
          <CardHeader className="p-4 pb-1 flex flex-row items-center justify-between">
            <span className="text-xs font-semibold text-[#71717A]">Active Time</span>
            <Clock className="h-4 w-4 text-[#C8FF47]" />
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <span className="font-display text-2xl font-black text-white">45</span>
            <span className="text-xs text-[#71717A] ml-1 font-mono">mins</span>
            <Progress value={75} className="mt-3" />
          </CardContent>
        </Card>

        <Card className="hover:border-[#C8FF47]/40 transition-colors">
          <CardHeader className="p-4 pb-1 flex flex-row items-center justify-between">
            <span className="text-xs font-semibold text-[#71717A]">Streak</span>
            <Flame className="h-4 w-4 text-[#C8FF47] fill-current" />
          </CardHeader>
          <CardContent className="p-4 pt-1">
            <span className="font-display text-2xl font-black text-white">5</span>
            <span className="text-xs text-[#71717A] ml-1 font-mono">Days</span>
            <Progress value={100} className="mt-3" />
          </CardContent>
        </Card>
      </div>

      {/* Feature preview card */}
      <Card className="p-6 border-dashed border-[#222228] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <CardTitle>AI Training Recommendations</CardTitle>
          <p className="text-xs text-[#71717A] mt-1">
            Application shell & mobile-first navigation active. Next milestone: Phase 3 Dashboard.
          </p>
        </div>
        <Link to={ROUTES.COACH}>
          <Button variant="outline" size="sm" className="gap-1.5">
            Ask AI Coach <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </Card>
    </PageContainer>
  );
}
