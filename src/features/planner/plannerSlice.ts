import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface DaySchedule {
  day: string;
  shortDay: string;
  isRestDay: boolean;
  workoutId: string | null;
  completed?: boolean;
  notes?: string;
}

interface PlannerState {
  schedule: DaySchedule[];
  assignModal: {
    isOpen: boolean;
    targetDay: string | null;
  };
}

const initialSchedule: DaySchedule[] = [
  {
    day: "Monday",
    shortDay: "MON",
    isRestDay: false,
    workoutId: "w-2", // Hypertrophy Chest & Back
    completed: true,
    notes: "Upper body push & pull compound focus",
  },
  {
    day: "Tuesday",
    shortDay: "TUE",
    isRestDay: false,
    workoutId: "w-4", // Quads & Hamstrings
    completed: true,
    notes: "Heavy squat compounds & posterior chain",
  },
  {
    day: "Wednesday",
    shortDay: "WED",
    isRestDay: true,
    workoutId: null,
    completed: true,
    notes: "Active mobility, 20m walk & hydration",
  },
  {
    day: "Thursday",
    shortDay: "THU",
    isRestDay: false,
    workoutId: "w-6", // Shoulder Boulders & Arms
    completed: true,
    notes: "Overhead press and arm supersets",
  },
  {
    day: "Friday",
    shortDay: "FRI",
    isRestDay: false,
    workoutId: "w-1", // Full Body HIIT
    completed: false,
    notes: "Metabolic conditioning circuit",
  },
  {
    day: "Saturday",
    shortDay: "SAT",
    isRestDay: false,
    workoutId: "w-7", // Kettlebell Power
    completed: false,
    notes: "Explosive triple extension & core power",
  },
  {
    day: "Sunday",
    shortDay: "SUN",
    isRestDay: true,
    workoutId: null,
    completed: false,
    notes: "Rest & recovery, foam rolling",
  },
];

const initialState: PlannerState = {
  schedule: initialSchedule,
  assignModal: {
    isOpen: false,
    targetDay: null,
  },
};

export const plannerSlice = createSlice({
  name: "planner",
  initialState,
  reducers: {
    assignWorkoutToDay: (
      state,
      action: PayloadAction<{ day: string; workoutId: string }>
    ) => {
      const item = state.schedule.find((d) => d.day === action.payload.day);
      if (item) {
        item.workoutId = action.payload.workoutId;
        item.isRestDay = false;
      }
      state.assignModal.isOpen = false;
      state.assignModal.targetDay = null;
    },
    toggleRestDay: (state, action: PayloadAction<string>) => {
      const item = state.schedule.find((d) => d.day === action.payload);
      if (item) {
        item.isRestDay = !item.isRestDay;
        if (item.isRestDay) {
          item.workoutId = null;
        }
      }
    },
    removeWorkoutFromDay: (state, action: PayloadAction<string>) => {
      const item = state.schedule.find((d) => d.day === action.payload);
      if (item) {
        item.workoutId = null;
      }
    },
    toggleDayCompletion: (state, action: PayloadAction<string>) => {
      const item = state.schedule.find((d) => d.day === action.payload);
      if (item) {
        item.completed = !item.completed;
      }
    },
    openAssignModal: (state, action: PayloadAction<string>) => {
      state.assignModal.isOpen = true;
      state.assignModal.targetDay = action.payload;
    },
    closeAssignModal: (state) => {
      state.assignModal.isOpen = false;
      state.assignModal.targetDay = null;
    },
  },
});

export const {
  assignWorkoutToDay,
  toggleRestDay,
  removeWorkoutFromDay,
  toggleDayCompletion,
  openAssignModal,
  closeAssignModal,
} = plannerSlice.actions;

export default plannerSlice.reducer;
