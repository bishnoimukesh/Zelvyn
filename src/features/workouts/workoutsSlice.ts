import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Workout } from "@/types";

interface WorkoutsState {
  items: Workout[];
  activeCategory: string;
  loading: boolean;
}

const initialState: WorkoutsState = {
  items: [
    {
      id: "w-1",
      title: "Full Body HIIT Ignition",
      category: "hiit",
      duration: 25,
      calories: 320,
      difficulty: "intermediate",
      thumbnail: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: "w-2",
      title: "Hypertrophy Chest & Back",
      category: "strength",
      duration: 45,
      calories: 410,
      difficulty: "advanced",
      thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: "w-3",
      title: "Core Power & Hip Mobility",
      category: "mobility",
      duration: 20,
      calories: 180,
      difficulty: "beginner",
      thumbnail: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=600",
    },
  ],
  activeCategory: "all",
  loading: false,
};

export const workoutsSlice = createSlice({
  name: "workouts",
  initialState,
  reducers: {
    setWorkouts: (state, action: PayloadAction<Workout[]>) => {
      state.items = action.payload;
    },
    setActiveCategory: (state, action: PayloadAction<string>) => {
      state.activeCategory = action.payload;
    },
  },
});

export const { setWorkouts, setActiveCategory } = workoutsSlice.actions;
export default workoutsSlice.reducer;
