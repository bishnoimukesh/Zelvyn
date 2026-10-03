import React from "react";
import { Link } from "react-router-dom";
import { Clock, Flame, Dumbbell, Play, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/app/hooks";
import { ROUTES } from "@/constants/routes";

export const TodayWorkoutCard: React.FC = () => {
  const workout = useAppSelector((state) => state.dashboard.todayWorkout);

  return (
    <Card className="relative overflow-hidden border border-[#222228] bg-[#111115] p-0 group">
      {/* Background Graphic & Gradient Overlay */}
      <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-[#1A1A1F]">
        <img
          src={workout.thumbnail}
          alt={workout.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111115] via-[#111115]/60 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="rounded-md bg-[#C8FF47] px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#08080A]">
              Today's Session
            </span>
            <Badge variant="secondary" className="text-[10px]">
              {workout.difficulty}
            </Badge>
          </div>
          <span className="rounded-full bg-[#08080A]/80 px-2.5 py-0.5 text-[10px] font-mono font-bold text-[#A1A1AA] backdrop-blur-md">
            {workout.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 pt-1 space-y-4">
        <div>
          <h3 className="font-display text-2xl sm:text-3xl font-black uppercase text-white group-hover:text-[#C8FF47] transition-colors">
            {workout.title}
          </h3>
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-2 text-xs font-mono text-[#A1A1AA]">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-[#C8FF47]" />
              {workout.duration} mins
            </span>
            <span className="flex items-center gap-1">
              <Flame className="h-3.5 w-3.5 text-[#C8FF47]" />
              {workout.calories} kcal
            </span>
            <span className="flex items-center gap-1">
              <Dumbbell className="h-3.5 w-3.5 text-[#C8FF47]" />
              {workout.exercisesCount} Exercises
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2 pt-1">
          <Link to={`/workouts/${workout.id}`} className="flex-1">
            <Button className="w-full gap-2 font-bold shadow-[0_0_15px_rgba(200,255,71,0.25)] hover:shadow-[0_0_20px_rgba(200,255,71,0.4)] transition-all">
              <Play className="h-4 w-4 fill-current" />
              <span>Start Workout</span>
            </Button>
          </Link>
          <Link to={ROUTES.WORKOUTS}>
            <Button
              variant="outline"
              size="icon"
              aria-label="View all routines"
              title="Browse catalog"
            >
              <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
};
