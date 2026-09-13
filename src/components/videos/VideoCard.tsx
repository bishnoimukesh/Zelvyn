import { WorkoutVideo } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Clock, Flame, Dumbbell, Star, Bookmark } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { toggleBookmark } from "@/features/videos/videosSlice";
import { cn } from "@/lib/utils";

interface VideoCardProps {
  video: WorkoutVideo;
  onPlay: (video: WorkoutVideo) => void;
}

export function VideoCard({ video, onPlay }: VideoCardProps) {
  const dispatch = useAppDispatch();
  const bookmarkedIds = useAppSelector((state) => state.videos.bookmarkedIds);
  const isBookmarked = bookmarkedIds.includes(video.id);

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleBookmark(video.id));
  };

  return (
    <Card
      id={`video-card-${video.id}`}
      onClick={() => onPlay(video)}
      className="group overflow-hidden border-[#222228] bg-[#121216] hover:border-[#C8FF47]/40 transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-[#181820]">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Floating Badges & Bookmark */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between z-10">
          <div className="flex items-center gap-1.5">
            <Badge variant="default" className="text-[10px] uppercase font-mono py-0 px-2 font-black">
              {video.category}
            </Badge>
            <Badge variant="secondary" className="text-[10px] uppercase font-mono py-0 px-2">
              {video.difficulty}
            </Badge>
          </div>

          <button
            type="button"
            id={`bookmark-btn-${video.id}`}
            onClick={handleBookmarkClick}
            className={cn(
              "h-7 w-7 rounded-full backdrop-blur-md flex items-center justify-center transition-all",
              isBookmarked
                ? "bg-[#C8FF47] text-black shadow-[0_0_10px_rgba(200,255,71,0.5)]"
                : "bg-black/60 text-white hover:bg-black/80 hover:text-[#C8FF47]"
            )}
            title={isBookmarked ? "Remove Bookmark" : "Save to Bookmarks"}
          >
            <Bookmark className="h-3.5 w-3.5 fill-current" />
          </button>
        </div>

        {/* Duration Pill in bottom right */}
        <div className="absolute bottom-2.5 right-2.5 z-10">
          <span className="bg-black/80 backdrop-blur-md px-2 py-0.5 rounded-md text-[11px] font-mono font-bold text-white flex items-center gap-1 border border-white/10">
            <Clock className="h-3 w-3 text-[#C8FF47]" /> {video.duration}:00
          </span>
        </div>

        {/* Hover Play Button Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="h-12 w-12 rounded-full bg-[#C8FF47] text-black flex items-center justify-center shadow-[0_0_20px_rgba(200,255,71,0.6)] transform scale-90 group-hover:scale-100 transition-transform">
            <Play className="h-5 w-5 fill-current ml-0.5" />
          </div>
        </div>
      </div>

      {/* Details Container */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div>
          {/* Trainer Info */}
          <div className="flex items-center gap-2 mb-2">
            <img
              src={video.trainer.avatar}
              alt={video.trainer.name}
              className="h-6 w-6 rounded-full object-cover border border-[#2A2A36]"
            />
            <span className="text-xs text-[#A1A1AA] font-semibold truncate">
              {video.trainer.name}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-display text-base font-bold text-white group-hover:text-[#C8FF47] transition-colors line-clamp-1 leading-snug">
            {video.title}
          </h3>
        </div>

        {/* Stats Row */}
        <div className="pt-2 border-t border-[#222228] flex items-center justify-between text-xs font-mono text-[#71717A]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-[#A1A1AA]">
              <Flame className="h-3 w-3 text-[#C8FF47]" /> {video.calories} kcal
            </span>
            <span className="hidden sm:inline-flex items-center gap-1">
              <Dumbbell className="h-3 w-3 text-[#71717A]" /> {video.equipment}
            </span>
          </div>

          <div className="flex items-center gap-1 text-white">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="font-bold">{video.rating}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
