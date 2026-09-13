import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  ProgressEntry,
  WeightLogEntry,
  CompletedWorkoutLog,
  ActivityHeatmapDay,
} from "@/types";

export interface StreakBadge {
  id: string;
  title: string;
  icon: string;
  description: string;
  unlocked: boolean;
}

export interface DayStepRecord {
  day: string;
  date: string;
  steps: number;
  goal: number;
}

export interface DayCalorieRecord {
  day: string;
  date: string;
  calories: number;
  target: number;
}

interface ProgressState {
  entries: ProgressEntry[];
  streakDays: number;
  weightTarget: number;
  weightStarting: number;
  weightHistory: WeightLogEntry[];
  selectedTimeframe: "7D" | "30D" | "90D" | "ALL";
  workoutHistory: CompletedWorkoutLog[];
  activityHeatmap: ActivityHeatmapDay[];
  streak: {
    current: number;
    longest: number;
    badges: StreakBadge[];
  };
  stepTracker: {
    todaySteps: number;
    goalSteps: number;
    weeklyDistribution: DayStepRecord[];
  };
  calorieTracker: {
    dailyTarget: number;
    weeklyDistribution: DayCalorieRecord[];
  };
}

const initialWeightHistory: WeightLogEntry[] = [
  { id: "w-1", date: "Aug 15", weight: 72.8, bodyFatPercent: 18.2, notes: "Baseline check" },
  { id: "w-2", date: "Aug 22", weight: 72.3, bodyFatPercent: 17.9, notes: "Consistent nutrition" },
  { id: "w-3", date: "Aug 29", weight: 71.8, bodyFatPercent: 17.5, notes: "Carb cycling week" },
  { id: "w-4", date: "Sep 05", weight: 71.1, bodyFatPercent: 17.1, notes: "Deload recovery" },
  { id: "w-5", date: "Sep 08", weight: 70.8, bodyFatPercent: 16.9, notes: "Hydration optimal" },
  { id: "w-6", date: "Sep 09", weight: 70.5, bodyFatPercent: 16.8 },
  { id: "w-7", date: "Sep 10", weight: 70.3, bodyFatPercent: 16.6 },
  { id: "w-8", date: "Sep 11", weight: 70.1, bodyFatPercent: 16.5, notes: "Post-HIIT morning" },
  { id: "w-9", date: "Sep 12", weight: 70.0, bodyFatPercent: 16.4 },
  { id: "w-10", date: "Sep 13", weight: 69.9, bodyFatPercent: 16.3, notes: "New 60-day low!" },
];

const initialWorkoutHistory: CompletedWorkoutLog[] = [
  {
    id: "hist-1",
    workoutId: "w-2",
    workoutTitle: "Hypertrophy Chest & Back",
    category: "strength",
    date: "Today, 10:30 AM",
    durationMinutes: 45,
    totalVolumeKg: 7440,
    caloriesBurned: 420,
    setsCompleted: 14,
    totalSets: 14,
  },
  {
    id: "hist-2",
    workoutId: "w-1",
    workoutTitle: "Full Body HIIT Ignition",
    category: "hiit",
    date: "Yesterday, 07:15 AM",
    durationMinutes: 25,
    totalVolumeKg: 2800,
    caloriesBurned: 340,
    setsCompleted: 11,
    totalSets: 11,
  },
  {
    id: "hist-3",
    workoutId: "w-4",
    workoutTitle: "Quads & Hamstrings Annihilation",
    category: "strength",
    date: "2 days ago",
    durationMinutes: 50,
    totalVolumeKg: 8200,
    caloriesBurned: 480,
    setsCompleted: 16,
    totalSets: 16,
  },
  {
    id: "hist-4",
    workoutId: "w-8",
    workoutTitle: "Zone 2 Aerobic Base Builder",
    category: "cardio",
    date: "3 days ago",
    durationMinutes: 40,
    totalVolumeKg: 0,
    caloriesBurned: 360,
    setsCompleted: 4,
    totalSets: 4,
  },
  {
    id: "hist-5",
    workoutId: "w-3",
    workoutTitle: "Core Power & Hip Mobility",
    category: "mobility",
    date: "4 days ago",
    durationMinutes: 20,
    totalVolumeKg: 0,
    caloriesBurned: 180,
    setsCompleted: 5,
    totalSets: 5,
  },
  {
    id: "hist-6",
    workoutId: "w-6",
    workoutTitle: "Shoulder Boulders & Arms Blast",
    category: "strength",
    date: "5 days ago",
    durationMinutes: 35,
    totalVolumeKg: 5100,
    caloriesBurned: 310,
    setsCompleted: 12,
    totalSets: 12,
  },
  {
    id: "hist-7",
    workoutId: "w-5",
    workoutTitle: "Tabata Sprint & Calisthenics",
    category: "hiit",
    date: "6 days ago",
    durationMinutes: 18,
    totalVolumeKg: 0,
    caloriesBurned: 260,
    setsCompleted: 8,
    totalSets: 8,
  },
];

// 28 Days Activity Heatmap
const initialActivityHeatmap: ActivityHeatmapDay[] = [
  { date: "Aug 17", dayOfWeek: "Mon", intensity: "moderate", workoutTitle: "Chest Hypertrophy", caloriesBurned: 410 },
  { date: "Aug 18", dayOfWeek: "Tue", intensity: "intense", workoutTitle: "HIIT Ignition", caloriesBurned: 350 },
  { date: "Aug 19", dayOfWeek: "Wed", intensity: "light", workoutTitle: "Mobility & Stretch", caloriesBurned: 180 },
  { date: "Aug 20", dayOfWeek: "Thu", intensity: "intense", workoutTitle: "Leg Annihilation", caloriesBurned: 490 },
  { date: "Aug 21", dayOfWeek: "Fri", intensity: "moderate", workoutTitle: "Arms Blast", caloriesBurned: 320 },
  { date: "Aug 22", dayOfWeek: "Sat", intensity: "none", workoutTitle: "Rest Day", caloriesBurned: 0 },
  { date: "Aug 23", dayOfWeek: "Sun", intensity: "light", workoutTitle: "Zone 2 Cardio", caloriesBurned: 280 },

  { date: "Aug 24", dayOfWeek: "Mon", intensity: "moderate", workoutTitle: "Upper Body Pull", caloriesBurned: 420 },
  { date: "Aug 25", dayOfWeek: "Tue", intensity: "intense", workoutTitle: "Tabata Sprint", caloriesBurned: 360 },
  { date: "Aug 26", dayOfWeek: "Wed", intensity: "light", workoutTitle: "Hip Mobility", caloriesBurned: 170 },
  { date: "Aug 27", dayOfWeek: "Thu", intensity: "intense", workoutTitle: "Squat Volume", caloriesBurned: 510 },
  { date: "Aug 28", dayOfWeek: "Fri", intensity: "moderate", workoutTitle: "Shoulders", caloriesBurned: 330 },
  { date: "Aug 29", dayOfWeek: "Sat", intensity: "none", workoutTitle: "Active Recovery", caloriesBurned: 120 },
  { date: "Aug 30", dayOfWeek: "Sun", intensity: "moderate", workoutTitle: "Aerobic Base", caloriesBurned: 350 },

  { date: "Aug 31", dayOfWeek: "Mon", intensity: "intense", workoutTitle: "Chest & Back", caloriesBurned: 440 },
  { date: "Sep 01", dayOfWeek: "Tue", intensity: "moderate", workoutTitle: "HIIT Circuit", caloriesBurned: 340 },
  { date: "Sep 02", dayOfWeek: "Wed", intensity: "light", workoutTitle: "Core Power", caloriesBurned: 190 },
  { date: "Sep 03", dayOfWeek: "Thu", intensity: "intense", workoutTitle: "Heavy Deadlifts", caloriesBurned: 480 },
  { date: "Sep 04", dayOfWeek: "Fri", intensity: "moderate", workoutTitle: "Accessory Arm", caloriesBurned: 310 },
  { date: "Sep 05", dayOfWeek: "Sat", intensity: "none", workoutTitle: "Rest Day", caloriesBurned: 0 },
  { date: "Sep 06", dayOfWeek: "Sun", intensity: "moderate", workoutTitle: "Zone 2 Run", caloriesBurned: 370 },

  { date: "Sep 07", dayOfWeek: "Mon", intensity: "intense", workoutTitle: "Tabata Calisthenics", caloriesBurned: 380 },
  { date: "Sep 08", dayOfWeek: "Tue", intensity: "moderate", workoutTitle: "Arms Blast", caloriesBurned: 340 },
  { date: "Sep 09", dayOfWeek: "Wed", intensity: "light", workoutTitle: "Mobility Flow", caloriesBurned: 210 },
  { date: "Sep 10", dayOfWeek: "Thu", intensity: "intense", workoutTitle: "Zone 2 Base", caloriesBurned: 400 },
  { date: "Sep 11", dayOfWeek: "Fri", intensity: "intense", workoutTitle: "Legs Annihilation", caloriesBurned: 520 },
  { date: "Sep 12", dayOfWeek: "Sat", intensity: "moderate", workoutTitle: "HIIT Ignition", caloriesBurned: 360 },
  { date: "Sep 13", dayOfWeek: "Sun", intensity: "intense", workoutTitle: "Hypertrophy Chest & Back", caloriesBurned: 430 },
];

const initialBadges: StreakBadge[] = [
  {
    id: "b1",
    title: "7-Day Warrior",
    icon: "🔥",
    description: "Completed active training or recovery 7 consecutive days",
    unlocked: true,
  },
  {
    id: "b2",
    title: "10k Volume Club",
    icon: "⚡",
    description: "Surpassed 10,000 kg total volume in a single microcycle",
    unlocked: true,
  },
  {
    id: "b3",
    title: "Metabolic Torch",
    icon: "💥",
    description: "Burned 2,500+ active kcal in workout sessions this week",
    unlocked: true,
  },
  {
    id: "b4",
    title: "Iron Consistency",
    icon: "🛡️",
    description: "Sustain a flawless 14-day training streak",
    unlocked: false,
  },
];

const initialSteps: DayStepRecord[] = [
  { day: "Mon", date: "Sep 07", steps: 10200, goal: 10000 },
  { day: "Tue", date: "Sep 08", steps: 11400, goal: 10000 },
  { day: "Wed", date: "Sep 09", steps: 8900, goal: 10000 },
  { day: "Thu", date: "Sep 10", steps: 10800, goal: 10000 },
  { day: "Fri", date: "Sep 11", steps: 12500, goal: 10000 },
  { day: "Sat", date: "Sep 12", steps: 9400, goal: 10000 },
  { day: "Sun", date: "Sep 13", steps: 10800, goal: 10000 },
];

const initialCalories: DayCalorieRecord[] = [
  { day: "Mon", date: "Sep 07", calories: 480, target: 500 },
  { day: "Tue", date: "Sep 08", calories: 560, target: 500 },
  { day: "Wed", date: "Sep 09", calories: 390, target: 500 },
  { day: "Thu", date: "Sep 10", calories: 520, target: 500 },
  { day: "Fri", date: "Sep 11", calories: 610, target: 500 },
  { day: "Sat", date: "Sep 12", calories: 440, target: 500 },
  { day: "Sun", date: "Sep 13", calories: 540, target: 500 },
];

const initialState: ProgressState = {
  entries: [
    { date: "Mon", weight: 70.8, caloriesBurned: 450, steps: 10200, activeMinutes: 45 },
    { date: "Tue", weight: 70.5, caloriesBurned: 520, steps: 11400, activeMinutes: 55 },
    { date: "Wed", weight: 70.3, caloriesBurned: 380, steps: 8900, activeMinutes: 35 },
    { date: "Thu", weight: 70.1, caloriesBurned: 490, steps: 10800, activeMinutes: 50 },
    { date: "Fri", weight: 69.9, caloriesBurned: 600, steps: 12500, activeMinutes: 60 },
  ],
  streakDays: 7,
  weightTarget: 68.0,
  weightStarting: 73.0,
  weightHistory: initialWeightHistory,
  selectedTimeframe: "30D",
  workoutHistory: initialWorkoutHistory,
  activityHeatmap: initialActivityHeatmap,
  streak: {
    current: 7,
    longest: 21,
    badges: initialBadges,
  },
  stepTracker: {
    todaySteps: 10800,
    goalSteps: 10000,
    weeklyDistribution: initialSteps,
  },
  calorieTracker: {
    dailyTarget: 500,
    weeklyDistribution: initialCalories,
  },
};

export const progressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {
    addProgressEntry: (state, action: PayloadAction<ProgressEntry>) => {
      state.entries.push(action.payload);
    },
    incrementStreak: (state) => {
      state.streakDays += 1;
      state.streak.current += 1;
      if (state.streak.current > state.streak.longest) {
        state.streak.longest = state.streak.current;
      }
    },
    logWeightEntry: (
      state,
      action: PayloadAction<{
        weight: number;
        bodyFatPercent?: number;
        notes?: string;
        date?: string;
      }>
    ) => {
      const { weight, bodyFatPercent, notes, date } = action.payload;
      const formattedDate = date || "Today";
      const newEntry: WeightLogEntry = {
        id: `w-${Date.now()}`,
        date: formattedDate,
        weight,
        bodyFatPercent,
        notes,
      };
      state.weightHistory.push(newEntry);

      // Also update latest entry for dashboard sync
      if (state.entries.length > 0) {
        state.entries[state.entries.length - 1].weight = weight;
      }
    },
    logCompletedWorkout: (state, action: PayloadAction<CompletedWorkoutLog>) => {
      state.workoutHistory.unshift(action.payload);
      state.streakDays += 1;
      state.streak.current += 1;
      if (state.streak.current > state.streak.longest) {
        state.streak.longest = state.streak.current;
      }
      // Update today's heatmap cell
      const todayCell = state.activityHeatmap[state.activityHeatmap.length - 1];
      if (todayCell) {
        todayCell.intensity = "intense";
        todayCell.workoutTitle = action.payload.workoutTitle;
        todayCell.caloriesBurned = action.payload.caloriesBurned;
      }
    },
    setTimeframeFilter: (
      state,
      action: PayloadAction<"7D" | "30D" | "90D" | "ALL">
    ) => {
      state.selectedTimeframe = action.payload;
    },
    updateStepGoal: (state, action: PayloadAction<number>) => {
      state.stepTracker.goalSteps = action.payload;
      state.stepTracker.weeklyDistribution.forEach((rec) => {
        rec.goal = action.payload;
      });
    },
    logStepsToday: (state, action: PayloadAction<number>) => {
      state.stepTracker.todaySteps += action.payload;
      const today =
        state.stepTracker.weeklyDistribution[
          state.stepTracker.weeklyDistribution.length - 1
        ];
      if (today) {
        today.steps += action.payload;
      }
    },
    updateCalorieTarget: (state, action: PayloadAction<number>) => {
      state.calorieTracker.dailyTarget = action.payload;
      state.calorieTracker.weeklyDistribution.forEach((rec) => {
        rec.target = action.payload;
      });
    },
  },
});

export const {
  addProgressEntry,
  incrementStreak,
  logWeightEntry,
  logCompletedWorkout,
  setTimeframeFilter,
  updateStepGoal,
  logStepsToday,
  updateCalorieTarget,
} = progressSlice.actions;

export default progressSlice.reducer;
