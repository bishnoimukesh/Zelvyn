import { useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  closeVideoPlayer,
  togglePlayPause,
  updatePlayerTime,
  setChapterIndex,
  incrementRepCounter,
  decrementRepCounter,
  resetRepCounter,
  setPlaybackSpeed,
  toggleMute,
} from "@/features/videos/videosSlice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  X,
  Plus,
  Minus,
  RotateCcw,
  Timer,
  Lightbulb,
  CheckCircle2,
  ListOrdered,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function VideoPlayerModal() {
  const dispatch = useAppDispatch();
  const { activeVideo, playerState } = useAppSelector((state) => state.videos);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const {
    isPlaying,
    currentTime,
    duration,
    currentChapterIndex,
    intervalRemainingSeconds,
    repCount,
    isMuted,
    playbackSpeed,
  } = playerState;

  // Sync HTML5 video play/pause with Redux
  useEffect(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.play().catch(() => {
        // Autoplay policy fallback
      });
    } else {
      videoRef.current.pause();
    }
  }, [isPlaying]);

  // Sync mute
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Sync speed
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  if (!activeVideo) return null;

  const currentChapter =
    activeVideo.chapters[currentChapterIndex] || activeVideo.chapters[0];

  const formatSeconds = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(mins).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    dispatch(
      updatePlayerTime({
        currentTime: videoRef.current.currentTime,
        duration: videoRef.current.duration || 0,
      })
    );
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
    dispatch(updatePlayerTime({ currentTime: newTime }));
  };

  const handleSelectChapter = (index: number) => {
    const targetChapter = activeVideo.chapters[index];
    if (targetChapter && videoRef.current) {
      videoRef.current.currentTime = targetChapter.timestampSeconds;
    }
    dispatch(setChapterIndex(index));
  };

  return (
    <div
      id="video-player-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300 overflow-y-auto"
    >
      <div className="relative w-full max-w-5xl rounded-3xl bg-[#101014] border border-[#222228] shadow-2xl overflow-hidden my-auto">
        {/* Top Floating Control Bar */}
        <div className="flex items-center justify-between p-4 bg-[#14141A] border-b border-[#222228]">
          <div className="flex items-center gap-3">
            <img
              src={activeVideo.trainer.avatar}
              alt={activeVideo.trainer.name}
              className="h-8 w-8 rounded-full object-cover border border-[#C8FF47]"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-sm font-bold text-white">
                  {activeVideo.title}
                </span>
                <Badge variant="secondary" className="text-[10px] py-0 font-mono">
                  {activeVideo.category}
                </Badge>
              </div>
              <span className="text-[11px] text-[#71717A] block font-mono">
                Guided by Coach {activeVideo.trainer.name}
              </span>
            </div>
          </div>

          <Button
            id="close-video-player-btn"
            variant="ghost"
            size="sm"
            onClick={() => dispatch(closeVideoPlayer())}
            className="h-8 w-8 p-0 rounded-full text-[#A1A1AA] hover:text-white hover:bg-[#22222C]"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Video Canvas & Controls Container */}
        <div className="relative aspect-video w-full bg-black">
          <video
            ref={videoRef}
            src={activeVideo.videoUrl}
            poster={activeVideo.thumbnail}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => dispatch(togglePlayPause())}
            className="h-full w-full object-contain"
            playsInline
          />

          {/* Bottom Video Controls Overlay */}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 flex flex-col gap-2">
            {/* Scrubber Range Input */}
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-[#2A2A36] rounded-lg appearance-none cursor-pointer accent-[#C8FF47]"
            />

            <div className="flex items-center justify-between text-xs font-mono text-white">
              {/* Play / Pause & Time */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  id="video-play-pause-btn"
                  onClick={() => dispatch(togglePlayPause())}
                  className="h-9 w-9 rounded-full bg-[#C8FF47] text-black flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4 fill-current" />
                  ) : (
                    <Play className="h-4 w-4 fill-current ml-0.5" />
                  )}
                </button>

                <div className="text-[11px]">
                  <span className="text-[#C8FF47] font-bold">
                    {formatSeconds(currentTime)}
                  </span>
                  <span className="text-[#71717A]"> / </span>
                  <span className="text-[#A1A1AA]">
                    {formatSeconds(duration || activeVideo.duration * 60)}
                  </span>
                </div>
              </div>

              {/* Speed & Mute */}
              <div className="flex items-center gap-2">
                {/* Speed buttons */}
                {[1.0, 1.25, 1.5].map((spd) => (
                  <button
                    key={spd}
                    type="button"
                    onClick={() => dispatch(setPlaybackSpeed(spd))}
                    className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold transition-colors",
                      playbackSpeed === spd
                        ? "bg-[#C8FF47] text-black"
                        : "bg-black/60 text-[#A1A1AA] hover:text-white"
                    )}
                  >
                    {spd}x
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => dispatch(toggleMute())}
                  className="h-8 w-8 rounded-lg bg-black/60 text-[#A1A1AA] hover:text-white flex items-center justify-center transition-colors"
                >
                  {isMuted ? (
                    <VolumeX className="h-4 w-4 text-red-400" />
                  ) : (
                    <Volume2 className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* Interactive Athletic HUD: Timers, Rep Counter, and Chapter Timeline       */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-6 bg-[#121216] border-t border-[#222228] grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Left HUD: Interval Timer & Form Cues */}
          <div className="md:col-span-2 space-y-4">
            {/* Active Movement Title & Timer */}
            <div className="p-4 rounded-2xl bg-[#181820] border border-[#2A2A36] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-[#C8FF47] px-2 py-0.5 rounded bg-[#C8FF47]/10 border border-[#C8FF47]/20">
                    Movement {currentChapterIndex + 1} of{" "}
                    {activeVideo.chapters.length}
                  </span>
                  <span className="text-xs font-mono text-[#71717A]">
                    {currentChapter.timeFormatted}
                  </span>
                </div>
                <h4 className="font-display text-lg font-bold text-white uppercase tracking-wide">
                  {currentChapter.name}
                </h4>
              </div>

              {/* Interval Countdown Timer Clock */}
              <div className="flex items-center gap-3 bg-[#121216] p-2.5 rounded-xl border border-[#2A2A36] self-start sm:self-auto">
                <div className="h-10 w-10 rounded-lg bg-[#C8FF47]/10 text-[#C8FF47] flex items-center justify-center">
                  <Timer className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#71717A] block">
                    Interval Remaining
                  </span>
                  <span
                    id="video-interval-timer"
                    className="font-mono text-2xl font-black text-[#C8FF47]"
                  >
                    {formatSeconds(intervalRemainingSeconds)}
                  </span>
                </div>
              </div>
            </div>

            {/* Coach Technique Cue Banner */}
            <div className="p-3.5 rounded-xl bg-[#15171C] border border-[#252836] flex items-start gap-3">
              <Lightbulb className="h-4 w-4 text-[#C8FF47] flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#C8FF47] font-bold block">
                  Coach Form Cue
                </span>
                <p className="text-xs text-[#E4E4E7] leading-relaxed mt-0.5">
                  "{currentChapter.formCue}"
                </p>
              </div>
            </div>

            {/* Rep Counter Interactive Card */}
            <div className="p-4 rounded-2xl bg-[#181820] border border-[#2A2A36] flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#71717A] block">
                  Interactive Rep Tracker
                </span>
                <div className="flex items-baseline gap-2">
                  <span
                    id="video-rep-counter"
                    className="font-mono text-3xl font-black text-white"
                  >
                    {repCount}
                  </span>
                  {currentChapter.targetReps && (
                    <span className="font-mono text-xs text-[#71717A]">
                      / {currentChapter.targetReps} Target Reps
                    </span>
                  )}
                </div>
              </div>

              {/* Rep Stepper Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  id="video-rep-minus-btn"
                  size="sm"
                  variant="outline"
                  onClick={() => dispatch(decrementRepCounter())}
                  className="h-9 w-9 p-0 rounded-xl border-[#2A2A36] bg-[#121216] text-white hover:bg-[#22222C]"
                >
                  <Minus className="h-4 w-4" />
                </Button>

                <Button
                  id="video-rep-plus-btn"
                  size="sm"
                  onClick={() => dispatch(incrementRepCounter())}
                  className="h-9 px-4 rounded-xl bg-[#C8FF47] text-black font-black uppercase text-xs hover:bg-[#b5f030] shadow-[0_0_15px_rgba(200,255,71,0.25)] flex items-center gap-1"
                >
                  <Plus className="h-4 w-4 stroke-[3]" /> Log Rep
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => dispatch(resetRepCounter())}
                  className="h-9 w-9 p-0 rounded-xl text-[#71717A] hover:text-white"
                  title="Reset counter"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Right HUD: Chapter Timeline */}
          <div className="p-4 rounded-2xl bg-[#181820] border border-[#2A2A36] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#2A2A36]">
              <span className="font-display text-xs font-bold uppercase text-white flex items-center gap-1.5">
                <ListOrdered className="h-3.5 w-3.5 text-[#C8FF47]" /> Workout Timeline
              </span>
              <span className="text-[10px] font-mono text-[#71717A]">
                {activeVideo.chapters.length} Movements
              </span>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {activeVideo.chapters.map((chap, idx) => {
                const isActive = currentChapterIndex === idx;
                const isPassed = currentChapterIndex > idx;

                return (
                  <div
                    key={chap.id}
                    id={`chapter-item-${idx}`}
                    onClick={() => handleSelectChapter(idx)}
                    className={cn(
                      "p-2.5 rounded-xl border text-left cursor-pointer transition-all duration-200 flex items-center justify-between gap-2",
                      isActive
                        ? "bg-[#1B2014] border-[#C8FF47] text-white"
                        : isPassed
                        ? "bg-[#14141A] border-[#222228] text-[#71717A] hover:text-white"
                        : "bg-[#14141A] border-[#222228] text-[#A1A1AA] hover:border-[#333342] hover:text-white"
                    )}
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="text-[10px] font-mono text-[#C8FF47] font-bold">
                          {chap.timeFormatted}
                        </span>
                        {isActive && (
                          <span className="h-1.5 w-1.5 rounded-full bg-[#C8FF47] animate-ping" />
                        )}
                      </div>
                      <span className="text-xs font-semibold block truncate">
                        {chap.name}
                      </span>
                    </div>

                    {isPassed ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <span className="text-[10px] font-mono text-[#71717A] flex-shrink-0">
                        {Math.floor(chap.durationSeconds / 60)}m
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
