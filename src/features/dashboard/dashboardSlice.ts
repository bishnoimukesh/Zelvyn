import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
}

const initialState: DashboardState = {
  metrics: {
    calories: { current: 540, target: 750, unit: "kcal" },
    steps: { current: 8420, target: 10000, unit: "steps" },
    activeTime: { current: 48, target: 60, unit: "mins" },
    hydration: { current: 2250, target: 3000, unit: "ml" },
    recovery: { score: 94, status: "Optimal" },
  },
  weeklyActivity: [
    { day: "Mon", calories: 640, duration: 50, completed: true },
    { day: "Tue", calories: 710, duration: 60, completed: true },
    { day: "Wed", calories: 480, duration: 40, completed: true },
    { day: "Thu", calories: 690, duration: 55, completed: true },
    { day: "Fri", calories: 540, duration: 48, completed: true, isToday: true },
    { day: "Sat", calories: 0, duration: 0, completed: false },
    { day: "Sun", calories: 0, duration: 0, completed: false },
  ],
  todayWorkout: {
    id: "workout-1",
    title: "Hypertrophy Chest & Back",
    category: "Strength",
    duration: 45,
    calories: 410,
    exercisesCount: 6,
    difficulty: "Advanced",
    thumbnail: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1200&q=80",
  },
  goals: [
    { id: "g1", title: "Target Weight", current: 70, target: 67, unit: "kg", progress: 67 },
    { id: "g2", title: "Weekly Workouts", current: 5, target: 6, unit: "sessions", progress: 83 },
    { id: "g3", title: "Monthly Steps", current: 242000, target: 300000, unit: "steps", progress: 81 },
  ],
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
});

export const { addWater, addSteps, addCalories, updateMetrics } =
  dashboardSlice.actions;
export default dashboardSlice.reducer;
