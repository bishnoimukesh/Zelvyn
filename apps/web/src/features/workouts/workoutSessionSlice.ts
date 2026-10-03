import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Workout, SetLog } from "@/types";

interface WorkoutSessionState {
  activeWorkoutId: string | null;
  isSessionActive: boolean;
  currentExerciseIndex: number;
  setLogs: Record<string, SetLog[]>;
  restTimer: {
    isRunning: boolean;
    duration: number;
    remaining: number;
  };
  elapsedSeconds: number;
  isCompleted: boolean;
  totalVolumeKg: number;
}

const initialState: WorkoutSessionState = {
  activeWorkoutId: null,
  isSessionActive: false,
  currentExerciseIndex: 0,
  setLogs: {},
  restTimer: {
    isRunning: false,
    duration: 60,
    remaining: 60,
  },
  elapsedSeconds: 0,
  isCompleted: false,
  totalVolumeKg: 0,
};

export const workoutSessionSlice = createSlice({
  name: "workoutSession",
  initialState,
  reducers: {
    startSession: (state, action: PayloadAction<Workout>) => {
      const workout = action.payload;
      state.activeWorkoutId = workout.id;
      state.isSessionActive = true;
      state.currentExerciseIndex = 0;
      state.elapsedSeconds = 0;
      state.isCompleted = false;
      state.totalVolumeKg = 0;
      state.restTimer = {
        isRunning: false,
        duration: 60,
        remaining: 60,
      };

      // Initialize sets for each exercise
      const initialLogs: Record<string, SetLog[]> = {};
      if (workout.exercises && workout.exercises.length > 0) {
        workout.exercises.forEach((ex) => {
          initialLogs[ex.id] = Array.from({ length: ex.sets }, (_, i) => ({
            setNumber: i + 1,
            targetReps: ex.reps,
            actualReps: parseInt(ex.reps) || 10,
            weightKg: 60,
            completed: false,
          }));
        });
      }
      state.setLogs = initialLogs;
    },

    toggleSetCompleted: (
      state,
      action: PayloadAction<{
        exerciseId: string;
        setIndex: number;
        actualReps?: number;
        weightKg?: number;
        restSeconds?: number;
      }>
    ) => {
      const { exerciseId, setIndex, actualReps, weightKg, restSeconds = 60 } =
        action.payload;
      const sets = state.setLogs[exerciseId];
      if (sets && sets[setIndex]) {
        const target = sets[setIndex];
        const nextCompleted = !target.completed;
        target.completed = nextCompleted;
        if (actualReps !== undefined) target.actualReps = actualReps;
        if (weightKg !== undefined) target.weightKg = weightKg;

        // Recalculate total tonnage volume
        let volume = 0;
        Object.values(state.setLogs).forEach((setList) => {
          setList.forEach((s) => {
            if (s.completed) {
              volume += s.actualReps * s.weightKg;
            }
          });
        });
        state.totalVolumeKg = volume;

        // Auto-start rest timer when a set is completed
        if (nextCompleted) {
          state.restTimer.isRunning = true;
          state.restTimer.duration = restSeconds;
          state.restTimer.remaining = restSeconds;
        }
      }
    },

    updateSetValues: (
      state,
      action: PayloadAction<{
        exerciseId: string;
        setIndex: number;
        actualReps: number;
        weightKg: number;
      }>
    ) => {
      const { exerciseId, setIndex, actualReps, weightKg } = action.payload;
      const sets = state.setLogs[exerciseId];
      if (sets && sets[setIndex]) {
        sets[setIndex].actualReps = actualReps;
        sets[setIndex].weightKg = weightKg;
      }
    },

    startRestTimer: (state, action: PayloadAction<number>) => {
      state.restTimer.isRunning = true;
      state.restTimer.duration = action.payload;
      state.restTimer.remaining = action.payload;
    },

    tickRestTimer: (state) => {
      if (state.restTimer.isRunning) {
        if (state.restTimer.remaining > 1) {
          state.restTimer.remaining -= 1;
        } else {
          state.restTimer.isRunning = false;
          state.restTimer.remaining = 0;
        }
      }
    },

    adjustRestTimer: (state, action: PayloadAction<number>) => {
      const next = state.restTimer.remaining + action.payload;
      state.restTimer.remaining = Math.max(0, Math.min(next, 300));
      if (!state.restTimer.isRunning && next > 0) {
        state.restTimer.isRunning = true;
      }
    },

    stopRestTimer: (state) => {
      state.restTimer.isRunning = false;
      state.restTimer.remaining = 0;
    },

    nextExercise: (state, action: PayloadAction<number>) => {
      const total = action.payload;
      if (state.currentExerciseIndex < total - 1) {
        state.currentExerciseIndex += 1;
        state.restTimer.isRunning = false;
      }
    },

    prevExercise: (state) => {
      if (state.currentExerciseIndex > 0) {
        state.currentExerciseIndex -= 1;
        state.restTimer.isRunning = false;
      }
    },

    setExerciseIndex: (state, action: PayloadAction<number>) => {
      state.currentExerciseIndex = action.payload;
      state.restTimer.isRunning = false;
    },

    tickElapsed: (state) => {
      if (state.isSessionActive && !state.isCompleted) {
        state.elapsedSeconds += 1;
      }
    },

    finishSession: (state) => {
      state.isCompleted = true;
      state.restTimer.isRunning = false;
    },

    resetSession: (state) => {
      state.activeWorkoutId = null;
      state.isSessionActive = false;
      state.isCompleted = false;
      state.elapsedSeconds = 0;
      state.currentExerciseIndex = 0;
      state.setLogs = {};
      state.restTimer.isRunning = false;
    },
  },
});

export const {
  startSession,
  toggleSetCompleted,
  updateSetValues,
  startRestTimer,
  tickRestTimer,
  adjustRestTimer,
  stopRestTimer,
  nextExercise,
  prevExercise,
  setExerciseIndex,
  tickElapsed,
  finishSession,
  resetSession,
} = workoutSessionSlice.actions;

export default workoutSessionSlice.reducer;
