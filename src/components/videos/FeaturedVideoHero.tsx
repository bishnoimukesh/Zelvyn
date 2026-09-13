import { WorkoutVideo } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Flame, Clock, Dumbbell, Star, Sparkles } from "lucide-react";

interface FeaturedVideoHeroProps {
  video: WorkoutVideo;
  onPlay: (video: WorkoutVideo) => void;
}

export function FeaturedVideoHero({ video, onPlay }: FeaturedVideoHeroProps) {
  return (
    <div
      id="featured-video-hero"
      className="relative w-full rounded-3xl overflow-hidden border border-[#222228] bg-[#121216] aspect-[16/9] sm:aspect-[21/9] group"
    >
      {/* Background Media */}
      <img
        src={video.thumbnail}
        alt={video.title}
        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
      />

      {/* Atmospheric dark gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-black/20 flex flex-col justify-between p-5 sm:p-8">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C8FF47] text-black font-black text-[11px] uppercase tracking-wider shadow-[0_0_15px_rgba(200,255,71,0.4)]">
              <Sparkles className="h-3.5 w-3.5 fill-current" /> Studio Spotlight
            </span>
            <Badge variant="secondary" className="text-xs uppercase font-mono">
              {video.category}
            </Badge>
            <Badge variant="outline" className="text-white border-[#333342] text-xs uppercase font-mono">
              {video.difficulty}
            </Badge>
          </div>

          <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-[#2A2A36] text-xs font-mono text-white">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="font-bold">{video.rating}</span>
            <span className="text-[#71717A]">({video.viewsCount} views)</span>
          </div>
        </div>

        {/* Bottom Details & CTA */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="max-w-xl space-y-2">
            {/* Trainer Profile Pill */}
            <div className="flex items-center gap-2.5">
              <img
                src={video.trainer.avatar}
                alt={video.trainer.name}
                className="h-9 w-9 rounded-full object-cover border-2 border-[#C8FF47]"
              />
              <div>
                <span className="text-xs font-bold text-white block">
                  Coach {video.trainer.name}
                </span>
                <span className="text-[10px] text-[#A1A1AA]">
                  {video.trainer.role}
                </span>
              </div>
            </div>

            <h2 className="font-display text-2xl sm:text-4xl font-black uppercase text-white tracking-wide leading-tight">
              {video.title}
            </h2>

            {/* Quick Metrics */}
            <div className="flex items-center gap-4 text-xs font-mono text-[#A1A1AA] flex-wrap">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-[#C8FF47]" /> {video.duration} mins
              </span>
              <span className="flex items-center gap-1">
                <Flame className="h-3.5 w-3.5 text-[#C8FF47]" /> {video.calories} kcal
              </span>
              <span className="flex items-center gap-1">
                <Dumbbell className="h-3.5 w-3.5 text-[#C8FF47]" /> {video.equipment}
              </span>
            </div>
          </div>

          {/* Action CTA Button */}
          <Button
            id="featured-play-btn"
            size="lg"
            onClick={() => onPlay(video)}
            className="rounded-2xl px-6 py-6 bg-[#C8FF47] text-black font-black uppercase tracking-wider text-sm shadow-[0_0_25px_rgba(200,255,71,0.4)] hover:bg-[#b5f030] hover:scale-105 transition-all flex items-center gap-2 self-start sm:self-auto flex-shrink-0"
          >
            <Play className="h-5 w-5 fill-current" /> Start Guided Routine
          </Button>
        </div>
      </div>
    </div>
  );
}
