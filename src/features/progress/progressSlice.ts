import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProgressEntry } from "@/types";

interface ProgressState {
  entries: ProgressEntry[];
  streakDays: number;
}

const initialState: ProgressState = {
  entries: [
    { date: "Mon", weight: 70.8, caloriesBurned: 450, steps: 10200, activeMinutes: 45 },
    { date: "Tue", weight: 70.5, caloriesBurned: 520, steps: 11400, activeMinutes: 55 },
    { date: "Wed", weight: 70.3, caloriesBurned: 380, steps: 8900, activeMinutes: 35 },
    { date: "Thu", weight: 70.1, caloriesBurned: 490, steps: 10800, activeMinutes: 50 },
    { date: "Fri", weight: 69.9, caloriesBurned: 600, steps: 12500, activeMinutes: 60 },
  ],
  streakDays: 5,
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
    },
  },
});

export const { addProgressEntry, incrementStreak } = progressSlice.actions;
export default progressSlice.reducer;
