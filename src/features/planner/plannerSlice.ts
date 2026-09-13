import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PlannerState {
  scheduledDays: Record<string, string[]>; // "Monday" -> ["workout-id"]
  selectedGoal: string;
}

const initialState: PlannerState = {
  scheduledDays: {
    Monday: ["w-1"],
    Wednesday: ["w-2"],
    Friday: ["w-3"],
  },
  selectedGoal: "weight_loss",
};

export const plannerSlice = createSlice({
  name: "planner",
  initialState,
  reducers: {
    scheduleWorkout: (
      state,
      action: PayloadAction<{ day: string; workoutId: string }>
    ) => {
      const { day, workoutId } = action.payload;
      if (!state.scheduledDays[day]) {
        state.scheduledDays[day] = [];
      }
      state.scheduledDays[day].push(workoutId);
    },
    setSelectedGoal: (state, action: PayloadAction<string>) => {
      state.selectedGoal = action.payload;
    },
  },
});

export const { scheduleWorkout, setSelectedGoal } = plannerSlice.actions;
export default plannerSlice.reducer;
