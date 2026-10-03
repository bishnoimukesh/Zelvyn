import React from "react";
import { Link } from "react-router-dom";
import { Clock, Flame, Dumbbell, CalendarPlus, Play } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Workout } from "@/types";

interface WorkoutCardProps {
  workout: Workout;
  onSchedule?: (workoutId: string) => void;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({ workout, onSchedule }) => {
  return (
    <Card className="overflow-hidden border border-[#222228] bg-[#111115] flex flex-col justify-between hover:border-[#C8FF47]/40 hover:shadow-[0_0_15px_rgba(200,255,71,0.08)] transition-all group">
      <div>
        {/* Thumbnail & Badges */}
        <div className="relative aspect-video w-full overflow-hidden bg-[#1A1A1F]">
          <img
            src={workout.thumbnail}
            alt={workout.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
            <div className="flex gap-1.5">
              <Badge variant="default" className="uppercase text-[10px] tracking-wider">
                {workout.category}
              </Badge>
              <Badge variant="secondary" className="capitalize text-[10px]">
                {workout.difficulty}
              </Badge>
            </div>
            {workout.bodyPart && (
              <span className="rounded-full bg-[#08080A]/80 px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider text-[#C8FF47] backdrop-blur-md">
                {workout.bodyPart.replace("_", " ")}
              </span>
            )}
          </div>
        </div>

        {/* Content */}
        <CardHeader className="p-4 pb-2">
          <CardTitle className="font-display text-lg font-black uppercase text-white group-hover:text-[#C8FF47] transition-colors line-clamp-1">
            {workout.title}
          </CardTitle>

          {workout.description && (
            <p className="text-xs text-[#71717A] line-clamp-2 mt-1 leading-relaxed">
              {workout.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-[#A1A1AA] pt-2">
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-[#C8FF47]" /> {workout.duration}m
            </span>
            <span className="flex items-center gap-1">
              <Flame className="h-3.5 w-3.5 text-[#C8FF47]" /> {workout.calories} kcal
            </span>
            {workout.equipment && (
              <span className="flex items-center gap-1 capitalize">
                <Dumbbell className="h-3.5 w-3.5 text-[#71717A]" /> {workout.equipment}
              </span>
            )}
          </div>
        </CardHeader>
      </div>

      {/* Action Footer */}
      <CardContent className="p-4 pt-2">
        <div className="flex items-center gap-2">
          {onSchedule && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onSchedule(workout.id)}
              className="flex-1 gap-1.5 text-xs font-bold border-[#222228] bg-[#14141A] hover:border-[#C8FF47]/40 hover:text-[#C8FF47]"
            >
              <CalendarPlus className="h-3.5 w-3.5" />
              <span>Schedule</span>
            </Button>
          )}
          <Link to={`/workouts/${workout.id}`} className={onSchedule ? "flex-1" : "w-full"}>
            <Button size="sm" className="w-full gap-1.5 font-bold shadow-[0_0_12px_rgba(200,255,71,0.2)]">
              <Play className="h-3.5 w-3.5 fill-current" />
              <span>Start</span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
