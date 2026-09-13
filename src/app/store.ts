import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";
import userReducer from "@/features/dashboard/userSlice";
import dashboardReducer from "@/features/dashboard/dashboardSlice";
import workoutsReducer from "@/features/workouts/workoutsSlice";
import workoutSessionReducer from "@/features/workouts/workoutSessionSlice";
import plannerReducer from "@/features/planner/plannerSlice";
import progressReducer from "@/features/progress/progressSlice";
import videosReducer from "@/features/videos/videosSlice";
import coachReducer from "@/features/coach/coachSlice";
import uiReducer from "@/features/ui/uiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    dashboard: dashboardReducer,
    workouts: workoutsReducer,
    workoutSession: workoutSessionReducer,
    planner: plannerReducer,
    progress: progressReducer,
    videos: videosReducer,
    coach: coachReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
