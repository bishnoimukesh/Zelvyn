import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { logService, type WorkoutStatsSummary } from "@/services/api/logService";
import type { CompletedWorkoutLog } from "@/types";

export interface MetricItem {
  current: number;
  target: number;
  unit: string;
}

export interface DayActivity {
  day: string;
  calories: number;
  duration: number;
  completed: boolean;
  isToday?: boolean;
}

export interface DashboardWorkout {
  id: string;
  title: string;
  category: string;
  duration: number;
  calories: number;
  exercisesCount: number;
  difficulty: string;
  thumbnail: string;
}

export interface GoalItem {
  id: string;
  title: string;
  current: number;
  target: number;
  unit: string;
  progress: number;
}

interface DashboardState {
  metrics: {
    calories: MetricItem;
    steps: MetricItem;
    activeTime: MetricItem;
    hydration: MetricItem;
    recovery: { score: number; status: string };
  };
  weeklyActivity: DayActivity[];
  todayWorkout: DashboardWorkout;
  goals: GoalItem[];
  recentLogs: CompletedWorkoutLog[];
  loading: boolean;
  isLiveSynced: boolean;
  error: string | null;
}

export const fetchDashboardStats = createAsyncThunk(
  "dashboard/fetchDashboardStats",
  async (userId: string) => {
    return await logService.getUserStatsSummary(userId);
  }
);

const initialState: DashboardState = {
  metrics: {
    calories: { current: 540, target: 750, unit: "kcal" },
    steps: { current: 8420, target: 10000, unit: "steps" },
    activeTime: { current: 48, target: 60, unit: "mins" },
    hydration: { current: 2250, target: 3000, unit: "ml" },
    recovery: { score: 94, status: "Optimal" },
  },
  weeklyActivity: [
    { day: "Mon", calories: 0, duration: 0, completed: false },
    { day: "Tue", calories: 410, duration: 45, completed: true },
    { day: "Wed", calories: 340, duration: 25, completed: true },
    { day: "Thu", calories: 480, duration: 50, completed: true },
    { day: "Fri", calories: 310, duration: 35, completed: true },
    { day: "Sat", calories: 0, duration: 0, completed: false, isToday: true },
    { day: "Sun", calories: 0, duration: 0, completed: false },
  ],
  todayWorkout: {
    id: "w-2",
    title: "Hypertrophy Chest & Back",
    category: "Strength",
    duration: 45,
    calories: 420,
    exercisesCount: 4,
    difficulty: "Advanced",
    thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
  },
  goals: [
    { id: "g1", title: "Target Weight", current: 70, target: 67, unit: "kg", progress: 67 },
    { id: "g2", title: "Weekly Workouts", current: 4, target: 6, unit: "sessions", progress: 67 },
    { id: "g3", title: "Monthly Steps", current: 242000, target: 300000, unit: "steps", progress: 81 },
  ],
  recentLogs: [],
  loading: false,
  isLiveSynced: false,
  error: null,
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    addWater: (state, action: PayloadAction<number>) => {
      const next = state.metrics.hydration.current + action.payload;
      state.metrics.hydration.current = Math.min(next, 5000);
    },
    addSteps: (state, action: PayloadAction<number>) => {
      state.metrics.steps.current += action.payload;
    },
    addCalories: (state, action: PayloadAction<number>) => {
      state.metrics.calories.current += action.payload;
    },
    updateMetrics: (
      state,
      action: PayloadAction<Partial<DashboardState["metrics"]>>
    ) => {
      state.metrics = { ...state.metrics, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchDashboardStats.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchDashboardStats.fulfilled, (state, action) => {
      state.loading = false;
      const data: WorkoutStatsSummary = action.payload;
      if (data) {
        state.isLiveSynced = true;
        if (data.weeklyActivity && data.weeklyActivity.length > 0) {
          state.weeklyActivity = data.weeklyActivity;
        }
        if (data.recentLogs) {
          state.recentLogs = data.recentLogs;
        }
        // Update today's burn / duration from the today item in weeklyActivity
        const todayItem = data.weeklyActivity?.find((d) => d.isToday);
        if (todayItem && todayItem.calories > 0) {
          state.metrics.calories.current = todayItem.calories;
          state.metrics.activeTime.current = todayItem.duration;
        }
        // Update goals workouts count
        const weeklyWorkoutsGoal = state.goals.find((g) => g.id === "g2");
        if (weeklyWorkoutsGoal) {
          weeklyWorkoutsGoal.current = data.totalWorkouts;
          weeklyWorkoutsGoal.progress = Math.min(
            100,
            Math.round((data.totalWorkouts / weeklyWorkoutsGoal.target) * 100)
          );
        }
      }
    });
    builder.addCase(fetchDashboardStats.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to load dashboard metrics";
    });
  },
});

export const { addWater, addSteps, addCalories, updateMetrics } =
  dashboardSlice.actions;
export default dashboardSlice.reducer;
