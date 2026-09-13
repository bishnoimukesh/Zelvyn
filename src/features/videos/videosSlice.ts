import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WorkoutVideo } from "@/types";

interface PlayerState {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  currentChapterIndex: number;
  intervalRemainingSeconds: number;
  repCount: number;
  isMuted: boolean;
  playbackSpeed: number;
}

interface VideosState {
  items: WorkoutVideo[];
  selectedCategory: "all" | "hiit" | "strength" | "mobility" | "yoga" | "cardio" | "core";
  searchQuery: string;
  bookmarkedIds: string[];
  activeVideo: WorkoutVideo | null;
  playerState: PlayerState;
}

const initialVideos: WorkoutVideo[] = [
  {
    id: "vid-1",
    title: "30-Min Full Body Metabolic Burn",
    trainer: {
      name: "Marcus Cole",
      role: "Elite Strength & Conditioning Coach",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    },
    category: "hiit",
    difficulty: "intermediate",
    duration: 30,
    calories: 360,
    thumbnail: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    equipment: "Dumbbells & Mat",
    viewsCount: "24.5k",
    rating: 4.9,
    isFeatured: true,
    chapters: [
      {
        id: "c-1",
        name: "Dynamic Joint Mobilization",
        timeFormatted: "00:00",
        timestampSeconds: 0,
        durationSeconds: 180,
        targetReps: 15,
        formCue: "Open chest, circle arms, and mobilize hips before explosive loading.",
      },
      {
        id: "c-2",
        name: "Dumbbell Thrusters & Squat Press",
        timeFormatted: "03:00",
        timestampSeconds: 180,
        durationSeconds: 300,
        targetReps: 12,
        formCue: "Explosively drive from the heels, locking out arms synchronously.",
      },
      {
        id: "c-3",
        name: "Mountain Climbers & Core Drive",
        timeFormatted: "08:00",
        timestampSeconds: 480,
        durationSeconds: 240,
        targetReps: 20,
        formCue: "Keep shoulders stacked over wrists; prevent lower back arching.",
      },
      {
        id: "c-4",
        name: "Burpee Box Overs & Metabolic Push",
        timeFormatted: "12:00",
        timestampSeconds: 720,
        durationSeconds: 360,
        targetReps: 10,
        formCue: "Chest brushes the ground, jump and turn in one fluid athletic leap.",
      },
      {
        id: "c-5",
        name: "Recovery Breathing & Cooldown",
        timeFormatted: "18:00",
        timestampSeconds: 1080,
        durationSeconds: 180,
        targetReps: 5,
        formCue: "Slow deep diaphragmatic inhales to accelerate parasympathetic recovery.",
      },
    ],
  },
  {
    id: "vid-2",
    title: "Hypertrophy Upper Body Push & Pull",
    trainer: {
      name: "Elena Rostova",
      role: "IFBB Physique Specialist",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    },
    category: "strength",
    difficulty: "advanced",
    duration: 40,
    calories: 420,
    thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    equipment: "Barbell & Bench",
    viewsCount: "18.2k",
    rating: 4.95,
    chapters: [
      {
        id: "c-2-1",
        name: "Scapular Retraction Warmup",
        timeFormatted: "00:00",
        timestampSeconds: 0,
        durationSeconds: 120,
        targetReps: 15,
        formCue: "Depress shoulder blades into bench before un-racking.",
      },
      {
        id: "c-2-2",
        name: "Incline Barbell Bench Press",
        timeFormatted: "02:00",
        timestampSeconds: 120,
        durationSeconds: 420,
        targetReps: 8,
        formCue: "Lower the bar with 3-second eccentric tempo to clavicular line.",
      },
      {
        id: "c-2-3",
        name: "Pendlay Barbell Rows",
        timeFormatted: "09:00",
        timestampSeconds: 540,
        durationSeconds: 360,
        targetReps: 10,
        formCue: "Explode bar to sternum from dead-stop on the floor.",
      },
      {
        id: "c-2-4",
        name: "Incline Dumbbell Chest Flyes",
        timeFormatted: "15:00",
        timestampSeconds: 900,
        durationSeconds: 300,
        targetReps: 12,
        formCue: "Feel the deep stretch across pectorals without hyperextending shoulders.",
      },
    ],
  },
  {
    id: "vid-3",
    title: "Deep Hip Mobility & Lower Back Relief",
    trainer: {
      name: "Dr. David Vance",
      role: "DPT & Biomechanics Coach",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    },
    category: "mobility",
    difficulty: "beginner",
    duration: 20,
    calories: 140,
    thumbnail: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    equipment: "Mat Only",
    viewsCount: "31.0k",
    rating: 4.88,
    chapters: [
      {
        id: "c-3-1",
        name: "90/90 Hip Internal/External Swivels",
        timeFormatted: "00:00",
        timestampSeconds: 0,
        durationSeconds: 240,
        targetReps: 10,
        formCue: "Keep spine tall while rotating knees smoothly side to side.",
      },
      {
        id: "c-3-2",
        name: "Segmental Cat-Cow & Thoracic Rotations",
        timeFormatted: "04:00",
        timestampSeconds: 240,
        durationSeconds: 240,
        targetReps: 8,
        formCue: "Articulate vertebrae one at a time starting from tailbone.",
      },
      {
        id: "c-3-3",
        name: "Deep Frog Stretch Adductor Decompression",
        timeFormatted: "08:00",
        timestampSeconds: 480,
        durationSeconds: 300,
        targetReps: 5,
        formCue: "Gently sink hips backward into the stretch on exhales.",
      },
    ],
  },
  {
    id: "vid-4",
    title: "Tabata Sprint & Calisthenics Burnout",
    trainer: {
      name: "Jordan Hayes",
      role: "MetCon Performance Specialist",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200",
    },
    category: "hiit",
    difficulty: "advanced",
    duration: 18,
    calories: 280,
    thumbnail: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
    equipment: "Bodyweight",
    viewsCount: "15.6k",
    rating: 4.92,
    chapters: [
      {
        id: "c-4-1",
        name: "High Knees & Fast Feet",
        timeFormatted: "00:00",
        timestampSeconds: 0,
        durationSeconds: 120,
        targetReps: 30,
        formCue: "Pump arms quickly and keep toes dorsiflexed.",
      },
      {
        id: "c-4-2",
        name: "Plyometric Clapping Pushups",
        timeFormatted: "02:00",
        timestampSeconds: 120,
        durationSeconds: 240,
        targetReps: 12,
        formCue: "Explode off the ground; absorb landing with soft bent elbows.",
      },
      {
        id: "c-4-3",
        name: "Alternating Jump Lunges",
        timeFormatted: "06:00",
        timestampSeconds: 360,
        durationSeconds: 240,
        targetReps: 16,
        formCue: "Land softly and sink back knee to one inch off floor.",
      },
    ],
  },
  {
    id: "vid-5",
    title: "Vinyasa Flow For Athletic Recovery",
    trainer: {
      name: "Maya Lin",
      role: "Yoga & Breathwork Instructor",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    },
    category: "yoga",
    difficulty: "beginner",
    duration: 25,
    calories: 180,
    thumbnail: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    equipment: "Mat Only",
    viewsCount: "22.1k",
    rating: 4.85,
    chapters: [
      {
        id: "c-5-1",
        name: "Sun Salutation Surya Namaskar A",
        timeFormatted: "00:00",
        timestampSeconds: 0,
        durationSeconds: 300,
        targetReps: 5,
        formCue: "Coordinate movement with inhalation on extension, exhalation on fold.",
      },
      {
        id: "c-5-2",
        name: "Warrior II into Extended Side Angle",
        timeFormatted: "05:00",
        timestampSeconds: 300,
        durationSeconds: 360,
        targetReps: 6,
        formCue: "Ground outer heel firmly; extend fingertips toward ceiling.",
      },
      {
        id: "c-5-3",
        name: "Savasana & Guided Restoration",
        timeFormatted: "11:00",
        timestampSeconds: 660,
        durationSeconds: 300,
        targetReps: 1,
        formCue: "Release all muscle tension; surrender weight to gravity.",
      },
    ],
  },
  {
    id: "vid-6",
    title: "Zone 2 Steady State Aerobic Engine",
    trainer: {
      name: "Chris Bailey",
      role: "Endurance & Heart Rate Coach",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
    },
    category: "cardio",
    difficulty: "beginner",
    duration: 35,
    calories: 320,
    thumbnail: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    equipment: "Treadmill or Mat",
    viewsCount: "12.8k",
    rating: 4.79,
    chapters: [
      {
        id: "c-6-1",
        name: "Mitochondrial Base Warmup",
        timeFormatted: "00:00",
        timestampSeconds: 0,
        durationSeconds: 300,
        targetReps: 1,
        formCue: "Keep heart rate strictly under 130 bpm (nasal breathing only).",
      },
      {
        id: "c-6-2",
        name: "Steady Cadence Interval 1",
        timeFormatted: "05:00",
        timestampSeconds: 300,
        durationSeconds: 600,
        targetReps: 1,
        formCue: "Maintain consistent stride frequency and relaxed shoulders.",
      },
    ],
  },
  {
    id: "vid-7",
    title: "Iron Core & Oblique Shredder",
    trainer: {
      name: "Samantha Reed",
      role: "Functional Core Coach",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200",
    },
    category: "core",
    difficulty: "intermediate",
    duration: 15,
    calories: 190,
    thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    equipment: "Mat Only",
    viewsCount: "42.3k",
    rating: 4.91,
    chapters: [
      {
        id: "c-7-1",
        name: "Deadbug Cross-Body Tension",
        timeFormatted: "00:00",
        timestampSeconds: 0,
        durationSeconds: 180,
        targetReps: 12,
        formCue: "Press lower back firmly into mat; avoid any arching.",
      },
      {
        id: "c-7-2",
        name: "Rotational Russian Twists",
        timeFormatted: "03:00",
        timestampSeconds: 180,
        durationSeconds: 240,
        targetReps: 20,
        formCue: "Rotate from thoracic spine rather than just swinging arms.",
      },
      {
        id: "c-7-3",
        name: "Hollow Body Rockers & Hold",
        timeFormatted: "07:00",
        timestampSeconds: 420,
        durationSeconds: 240,
        targetReps: 10,
        formCue: "Banana posture with quads locked and toes pointed.",
      },
    ],
  },
  {
    id: "vid-8",
    title: "Kettlebell Ballistic Power & Cleans",
    trainer: {
      name: "Marcus Cole",
      role: "Elite Strength Coach",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
    },
    category: "strength",
    difficulty: "advanced",
    duration: 30,
    calories: 350,
    thumbnail: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&q=80&w=800",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4",
    equipment: "Kettlebell (16-24kg)",
    viewsCount: "19.4k",
    rating: 4.96,
    chapters: [
      {
        id: "c-8-1",
        name: "Pendulum Hip Hinge Primer",
        timeFormatted: "00:00",
        timestampSeconds: 0,
        durationSeconds: 180,
        targetReps: 15,
        formCue: "Snap glutes aggressively to propel bell to eye level.",
      },
      {
        id: "c-8-2",
        name: "Single-Arm Clean to Rack",
        timeFormatted: "03:00",
        timestampSeconds: 180,
        durationSeconds: 360,
        targetReps: 10,
        formCue: "Keep bell close to body; tame the arc into soft rack position.",
      },
      {
        id: "c-8-3",
        name: "Heavy Goblet Squats with Pause",
        timeFormatted: "09:00",
        timestampSeconds: 540,
        durationSeconds: 300,
        targetReps: 12,
        formCue: "Pause for 2 seconds in deep hip hinge; keep chest upright.",
      },
    ],
  },
];

const initialPlayerState: PlayerState = {
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  currentChapterIndex: 0,
  intervalRemainingSeconds: 180,
  repCount: 0,
  isMuted: false,
  playbackSpeed: 1.0,
};

const initialState: VideosState = {
  items: initialVideos,
  selectedCategory: "all",
  searchQuery: "",
  bookmarkedIds: ["vid-1", "vid-3"],
  activeVideo: null,
  playerState: initialPlayerState,
};

export const videosSlice = createSlice({
  name: "videos",
  initialState,
  reducers: {
    setSelectedCategory: (
      state,
      action: PayloadAction<
        "all" | "hiit" | "strength" | "mobility" | "yoga" | "cardio" | "core"
      >
    ) => {
      state.selectedCategory = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    toggleBookmark: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.bookmarkedIds.includes(id)) {
        state.bookmarkedIds = state.bookmarkedIds.filter((item) => item !== id);
      } else {
        state.bookmarkedIds.push(id);
      }
    },
    openVideoPlayer: (state, action: PayloadAction<WorkoutVideo>) => {
      state.activeVideo = action.payload;
      state.playerState.isPlaying = true;
      state.playerState.currentTime = 0;
      state.playerState.currentChapterIndex = 0;
      state.playerState.repCount = 0;
      state.playerState.intervalRemainingSeconds =
        action.payload.chapters[0]?.durationSeconds || 180;
    },
    closeVideoPlayer: (state) => {
      state.activeVideo = null;
      state.playerState.isPlaying = false;
      state.playerState.currentTime = 0;
      state.playerState.currentChapterIndex = 0;
      state.playerState.repCount = 0;
    },
    togglePlayPause: (state) => {
      state.playerState.isPlaying = !state.playerState.isPlaying;
    },
    updatePlayerTime: (
      state,
      action: PayloadAction<{ currentTime: number; duration?: number }>
    ) => {
      state.playerState.currentTime = action.payload.currentTime;
      if (action.payload.duration) {
        state.playerState.duration = action.payload.duration;
      }
      // Update chapter based on timestamp
      if (state.activeVideo && state.activeVideo.chapters) {
        const chapters = state.activeVideo.chapters;
        for (let i = chapters.length - 1; i >= 0; i--) {
          if (action.payload.currentTime >= chapters[i].timestampSeconds) {
            if (state.playerState.currentChapterIndex !== i) {
              state.playerState.currentChapterIndex = i;
              state.playerState.repCount = 0;
            }
            const elapsedInChapter =
              action.payload.currentTime - chapters[i].timestampSeconds;
            state.playerState.intervalRemainingSeconds = Math.max(
              0,
              chapters[i].durationSeconds - Math.floor(elapsedInChapter)
            );
            break;
          }
        }
      }
    },
    setChapterIndex: (state, action: PayloadAction<number>) => {
      const idx = action.payload;
      if (state.activeVideo && state.activeVideo.chapters[idx]) {
        state.playerState.currentChapterIndex = idx;
        state.playerState.currentTime =
          state.activeVideo.chapters[idx].timestampSeconds;
        state.playerState.intervalRemainingSeconds =
          state.activeVideo.chapters[idx].durationSeconds;
        state.playerState.repCount = 0;
      }
    },
    incrementRepCounter: (state) => {
      state.playerState.repCount += 1;
    },
    decrementRepCounter: (state) => {
      state.playerState.repCount = Math.max(0, state.playerState.repCount - 1);
    },
    resetRepCounter: (state) => {
      state.playerState.repCount = 0;
    },
    setPlaybackSpeed: (state, action: PayloadAction<number>) => {
      state.playerState.playbackSpeed = action.payload;
    },
    toggleMute: (state) => {
      state.playerState.isMuted = !state.playerState.isMuted;
    },
  },
});

export const {
  setSelectedCategory,
  setSearchQuery,
  toggleBookmark,
  openVideoPlayer,
  closeVideoPlayer,
  togglePlayPause,
  updatePlayerTime,
  setChapterIndex,
  incrementRepCounter,
  decrementRepCounter,
  resetRepCounter,
  setPlaybackSpeed,
  toggleMute,
} = videosSlice.actions;

export default videosSlice.reducer;
