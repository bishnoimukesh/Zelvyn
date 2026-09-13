import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { PageContainer } from "@/components/layout/PageContainer";
import { FeaturedVideoHero } from "@/components/videos/FeaturedVideoHero";
import { VideoCategoryFilters } from "@/components/videos/VideoCategoryFilters";
import { VideoCard } from "@/components/videos/VideoCard";
import { VideoPlayerModal } from "@/components/videos/VideoPlayerModal";
import { openVideoPlayer } from "@/features/videos/videosSlice";
import { WorkoutVideo } from "@/types";

export function VideosPage() {
  const dispatch = useAppDispatch();
  const { items, selectedCategory, searchQuery, activeVideo } = useAppSelector(
    (state) => state.videos
  );

  // Featured video is the first featured video or first video in list
  const featuredVideo = items.find((v) => v.isFeatured) || items[0];

  // Filter videos by category and search query
  const filteredVideos = items.filter((video) => {
    const matchesCategory =
      selectedCategory === "all" || video.category === selectedCategory;

    const query = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !query ||
      video.title.toLowerCase().includes(query) ||
      video.trainer.name.toLowerCase().includes(query) ||
      video.equipment.toLowerCase().includes(query) ||
      video.category.toLowerCase().includes(query);

    return matchesCategory && matchesQuery;
  });

  const handlePlayVideo = (video: WorkoutVideo) => {
    dispatch(openVideoPlayer(video));
  };

  return (
    <PageContainer
      title="Coach-Led Video Workouts"
      description="Follow guided studio sessions with elite trainers, live interval countdowns, rep counters, and real-time form cues."
      badge="Studio Sessions"
    >
      <div className="space-y-6" id="video-library-container">
        {/* Featured Video Spotlight Hero */}
        {featuredVideo && !searchQuery && selectedCategory === "all" && (
          <FeaturedVideoHero
            video={featuredVideo}
            onPlay={handlePlayVideo}
          />
        )}

        {/* Search & Category Filter Toolbar */}
        <VideoCategoryFilters />

        {/* Video Grid Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-base font-bold uppercase tracking-wider text-white">
              Available Sessions ({filteredVideos.length})
            </h3>
            {searchQuery && (
              <span className="text-xs font-mono text-[#71717A]">
                Filtered by "{searchQuery}"
              </span>
            )}
          </div>

          {filteredVideos.length === 0 ? (
            <div className="p-12 text-center text-[#71717A] text-sm bg-[#121216] rounded-3xl border border-[#222228] font-mono">
              No workout sessions found matching your filters. Try adjusting your
              search query or category.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredVideos.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  onPlay={handlePlayVideo}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Video Player Modal Theater */}
      {activeVideo && <VideoPlayerModal />}
    </PageContainer>
  );
}
