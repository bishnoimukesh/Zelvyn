import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, Flame, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useAppSelector } from "@/app/hooks";
import { ROUTES } from "@/constants/routes";
import { PageContainer } from "@/components/layout/PageContainer";

export function WorkoutDetailPage() {
  const { id } = useParams<{ id: string }>();
  const workouts = useAppSelector((state) => state.workouts.items);
  const workout = workouts.find((w) => w.id === id) || workouts[0];

  return (
    <PageContainer>
      <Link
        to={ROUTES.WORKOUTS}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#71717A] hover:text-[#C8FF47] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Workouts
      </Link>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="default">{workout.category}</Badge>
          <Badge variant="secondary">{workout.difficulty}</Badge>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-black uppercase text-white">
          {workout.title}
        </h1>
        <div className="flex items-center gap-4 text-xs font-semibold text-[#71717A] mt-2 font-mono">
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-[#C8FF47]" /> {workout.duration} mins
          </span>
          <span className="flex items-center gap-1">
            <Flame className="h-4 w-4 text-[#C8FF47]" /> {workout.calories} kcal
          </span>
        </div>
      </div>

      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-[#1A1A1F] border border-[#222228]">
        <img
          src={workout.thumbnail}
          alt={workout.title}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <Button size="lg" className="rounded-full h-16 w-16 p-0 font-black shadow-[0_0_20px_rgba(200,255,71,0.5)] hover:scale-105 transition-transform">
            <Play className="h-8 w-8 fill-current ml-1" />
          </Button>
        </div>
      </div>

      <Card className="p-5 border-[#222228]">
        <h3 className="font-display text-lg font-bold uppercase text-white mb-2">
          Workout Overview
        </h3>
        <p className="text-xs text-[#71717A] leading-relaxed">
          Interactive exercise video player, rep tracking, and interval rest timer architecture prepared for Phase 6 (Workout Details).
        </p>
      </Card>
    </PageContainer>
  );
}
