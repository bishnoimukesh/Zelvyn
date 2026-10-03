import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { habitsService, HabitItem } from "@/services/api/habitsService";

interface HabitsState {
  habits: HabitItem[];
  loading: boolean;
  error: string | null;
  source: string;
  isSaving: boolean;
}

const initialState: HabitsState = {
  habits: [],
  loading: false,
  error: null,
  source: "mongodb",
  isSaving: false,
};

export const fetchHabits = createAsyncThunk(
  "habits/fetchHabits",
  async (userId: string = "default_user", { rejectWithValue }) => {
    try {
      return await habitsService.getHabits(userId);
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to load habits");
    }
  }
);

export const updateHabitProgressAsync = createAsyncThunk(
  "habits/updateHabitProgress",
  async (
    payload: { userId?: string; habitId: string; delta?: number; value?: number },
    { rejectWithValue }
  ) => {
    try {
      return await habitsService.updateProgress(payload);
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to update habit progress");
    }
  }
);

export const addCustomHabitAsync = createAsyncThunk(
  "habits/addCustomHabit",
  async (
    payload: {
      userId?: string;
      name: string;
      target: number;
      unit: string;
      color?: string;
      iconKey?: string;
      step?: number;
      category?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      return await habitsService.addCustomHabit(payload);
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to add custom habit");
    }
  }
);

export const deleteHabitAsync = createAsyncThunk(
  "habits/deleteHabit",
  async (
    payload: { habitId: string; userId?: string },
    { rejectWithValue }
  ) => {
    try {
      await habitsService.deleteHabit(payload.habitId, payload.userId);
      return payload.habitId;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to delete habit");
    }
  }
);

const habitsSlice = createSlice({
  name: "habits",
  initialState,
  reducers: {
    optimisticUpdate: (
      state,
      action: PayloadAction<{ habitId: string; delta?: number; value?: number }>
    ) => {
      const { habitId, delta, value } = action.payload;
      const habit = state.habits.find((h) => h.habitId === habitId);
      if (habit) {
        if (typeof value === "number") {
          habit.current = Math.max(0, value);
        } else if (typeof delta === "number") {
          habit.current = Math.max(0, habit.current + delta);
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchHabits
      .addCase(fetchHabits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHabits.fulfilled, (state, action) => {
        state.loading = false;
        state.habits = action.payload.data;
        if (action.payload.source) {
          state.source = action.payload.source;
        }
      })
      .addCase(fetchHabits.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // updateHabitProgress
      .addCase(updateHabitProgressAsync.pending, (state) => {
        state.isSaving = true;
      })
      .addCase(updateHabitProgressAsync.fulfilled, (state, action) => {
        state.isSaving = false;
        const updated = action.payload;
        const idx = state.habits.findIndex((h) => h.habitId === updated.habitId);
        if (idx !== -1) {
          state.habits[idx] = updated;
        }
      })
      .addCase(updateHabitProgressAsync.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload as string;
      })

      // addCustomHabit
      .addCase(addCustomHabitAsync.fulfilled, (state, action) => {
        state.habits.push(action.payload);
      })

      // deleteHabit
      .addCase(deleteHabitAsync.fulfilled, (state, action) => {
        state.habits = state.habits.filter((h) => h.habitId !== action.payload);
      });
  },
});

export const { optimisticUpdate } = habitsSlice.actions;
export const habitsReducer = habitsSlice.reducer;
