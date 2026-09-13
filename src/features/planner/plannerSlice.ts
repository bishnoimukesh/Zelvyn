import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CalendarDayEntry, ReminderConfig, SplitTemplate } from "@/types";

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
  activeView: "week" | "month";
  selectedMonthDate: string;
  monthDays: CalendarDayEntry[];
  reminderSettings: ReminderConfig;
  isReminderModalOpen: boolean;
  isTemplateModalOpen: boolean;
  templates: SplitTemplate[];
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

export const SPLIT_TEMPLATES: SplitTemplate[] = [
  {
    id: "ppl",
    title: "Push / Pull / Legs (PPL)",
    description: "6-day hypertrophy split maximizing frequency and muscle group volume.",
    category: "Hypertrophy",
    daysCount: 6,
    scheduleMap: {
      Monday: { workoutId: "w-2", isRestDay: false, notes: "Chest & Triceps Push" },
      Tuesday: { workoutId: "w-6", isRestDay: false, notes: "Back & Biceps Pull" },
      Wednesday: { workoutId: "w-4", isRestDay: false, notes: "Quads & Hamstrings Legs" },
      Thursday: { workoutId: "w-2", isRestDay: false, notes: "Hypertrophy Push Repeat" },
      Friday: { workoutId: "w-6", isRestDay: false, notes: "Hypertrophy Pull Repeat" },
      Saturday: { workoutId: "w-4", isRestDay: false, notes: "Posterior Chain Legs" },
      Sunday: { workoutId: null, isRestDay: true, notes: "Rest & Active Recovery" },
    },
  },
  {
    id: "upper_lower",
    title: "Upper / Lower 4-Day Split",
    description: "Balanced strength and hypertrophy split with dedicated recovery windows.",
    category: "Strength",
    daysCount: 4,
    scheduleMap: {
      Monday: { workoutId: "w-2", isRestDay: false, notes: "Heavy Upper Compound Push/Pull" },
      Tuesday: { workoutId: "w-4", isRestDay: false, notes: "Heavy Squat Lower Body" },
      Wednesday: { workoutId: null, isRestDay: true, notes: "Active Mobility & Aerobic Zone 2" },
      Thursday: { workoutId: "w-9", isRestDay: false, notes: "Upper Body Hypertrophy" },
      Friday: { workoutId: "w-4", isRestDay: false, notes: "Lower Body Volume & Glutes" },
      Saturday: { workoutId: null, isRestDay: true, notes: "Rest & Foam Rolling" },
      Sunday: { workoutId: null, isRestDay: true, notes: "Rest & Recovery" },
    },
  },
  {
    id: "full_body_3x",
    title: "Full Body Athletic 3x",
    description: "3 days of high-stimulus full body compound conditioning with 4 rest days.",
    category: "Athletic Conditioning",
    daysCount: 3,
    scheduleMap: {
      Monday: { workoutId: "w-1", isRestDay: false, notes: "Full Body HIIT & Compounds" },
      Tuesday: { workoutId: null, isRestDay: true, notes: "Active Recovery & Mobility" },
      Wednesday: { workoutId: "w-7", isRestDay: false, notes: "Kettlebell Power & Triple Extension" },
      Thursday: { workoutId: null, isRestDay: true, notes: "Active Recovery" },
      Friday: { workoutId: "w-1", isRestDay: false, notes: "Full Body Metabolic Ignition" },
      Saturday: { workoutId: null, isRestDay: true, notes: "Rest Day" },
      Sunday: { workoutId: null, isRestDay: true, notes: "Rest & Sleep Optimization" },
    },
  },
  {
    id: "hiit_core",
    title: "HIIT & Core Fat Loss Split",
    description: "High-density metabolic intervals with dedicated core and mobility days.",
    category: "Fat Loss",
    daysCount: 4,
    scheduleMap: {
      Monday: { workoutId: "w-1", isRestDay: false, notes: "Full Body HIIT Ignition" },
      Tuesday: { workoutId: "w-3", isRestDay: false, notes: "Core Power & Hip Mobility" },
      Wednesday: { workoutId: null, isRestDay: true, notes: "Zone 2 Active Walk" },
      Thursday: { workoutId: "w-5", isRestDay: false, notes: "Tabata Sprint & Calisthenics" },
      Friday: { workoutId: "w-3", isRestDay: false, notes: "Rotational Core & Pelvis" },
      Saturday: { workoutId: null, isRestDay: true, notes: "Rest Day" },
      Sunday: { workoutId: null, isRestDay: true, notes: "Active Stretch & Foam Roll" },
    },
  },
];

// September 2026 month calendar days (5 weeks x 7 days = 35 days)
const generateSeptemberDays = (): CalendarDayEntry[] => {
  const days: CalendarDayEntry[] = [];
  const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Week 1 (Aug 31 to Sep 6)
  days.push({
    dateString: "2026-08-31",
    dayNumber: 31,
    dayName: "Mon",
    isCurrentMonth: false,
    isToday: false,
    workoutId: "w-2",
    completed: true,
  });

  for (let i = 1; i <= 30; i++) {
    const dayOfWeekIdx = (i - 1 + 1) % 7; // Sep 1 is Tuesday
    const dateStr = `2026-09-${String(i).padStart(2, "0")}`;
    const isToday = i === 13;
    const isPast = i < 13;

    let workoutId: string | null = null;
    let isRestDay = false;
    let completed = false;

    // Pattern for demo
    if (i === 1) { workoutId = "w-1"; completed = true; }
    else if (i === 2) { workoutId = "w-4"; completed = true; }
    else if (i === 3) { isRestDay = true; completed = true; }
    else if (i === 4) { workoutId = "w-6"; completed = true; }
    else if (i === 5) { isRestDay = true; completed = true; }
    else if (i === 6) { workoutId = "w-8"; completed = true; }
    else if (i === 7) { workoutId = "w-2"; completed = true; }
    else if (i === 8) { workoutId = "w-4"; completed = true; }
    else if (i === 9) { isRestDay = true; completed = true; }
    else if (i === 10) { workoutId = "w-6"; completed = true; }
    else if (i === 11) { workoutId = "w-1"; completed = true; }
    else if (i === 12) { workoutId = "w-7"; completed = true; }
    else if (i === 13) { workoutId = "w-2"; isRestDay = false; completed = false; }
    else if (i === 14) { workoutId = "w-4"; isRestDay = false; completed = false; }
    else if (i === 15) { isRestDay = true; completed = false; }
    else if (i === 16) { workoutId = "w-6"; isRestDay = false; completed = false; }
    else if (i === 17) { workoutId = "w-1"; isRestDay = false; completed = false; }
    else if (i === 18) { workoutId = "w-7"; isRestDay = false; completed = false; }
    else if (i === 19) { isRestDay = true; completed = false; }
    else if (i % 2 === 0) { workoutId = "w-2"; }
    else { isRestDay = true; }

    days.push({
      dateString: dateStr,
      dayNumber: i,
      dayName: dayNames[dayOfWeekIdx],
      isCurrentMonth: true,
      isToday,
      workoutId,
      isRestDay,
      completed: isPast ? true : completed,
    });
  }

  // Week 5 overflow into October (Oct 1 to Oct 4)
  for (let o = 1; o <= 4; o++) {
    days.push({
      dateString: `2026-10-0${o}`,
      dayNumber: o,
      dayName: dayNames[(o + 2) % 7],
      isCurrentMonth: false,
      isToday: false,
      workoutId: o % 2 === 0 ? "w-4" : null,
      isRestDay: o % 2 !== 0,
      completed: false,
    });
  }

  return days;
};

const initialReminderConfig: ReminderConfig = {
  enabled: true,
  time: "07:30",
  leadTimeMinutes: 15,
  notifyRestDays: true,
  pushPermission: "default",
};

const initialState: PlannerState = {
  schedule: initialSchedule,
  assignModal: {
    isOpen: false,
    targetDay: null,
  },
  activeView: "week",
  selectedMonthDate: "2026-09",
  monthDays: generateSeptemberDays(),
  reminderSettings: initialReminderConfig,
  isReminderModalOpen: false,
  isTemplateModalOpen: false,
  templates: SPLIT_TEMPLATES,
};

export const plannerSlice = createSlice({
  name: "planner",
  initialState,
  reducers: {
    setActiveView: (state, action: PayloadAction<"week" | "month">) => {
      state.activeView = action.payload;
    },
    toggleReminderModal: (state, action: PayloadAction<boolean>) => {
      state.isReminderModalOpen = action.payload;
    },
    toggleTemplateModal: (state, action: PayloadAction<boolean>) => {
      state.isTemplateModalOpen = action.payload;
    },
    updateReminderSettings: (
      state,
      action: PayloadAction<Partial<ReminderConfig>>
    ) => {
      state.reminderSettings = { ...state.reminderSettings, ...action.payload };
    },
    applySplitTemplate: (state, action: PayloadAction<string>) => {
      const template = state.templates.find((t) => t.id === action.payload);
      if (template) {
        state.schedule.forEach((dayItem) => {
          const mapping =
            template.scheduleMap[
              dayItem.day as keyof typeof template.scheduleMap
            ];
          if (mapping) {
            dayItem.workoutId = mapping.workoutId;
            dayItem.isRestDay = mapping.isRestDay;
            dayItem.notes = mapping.notes;
            dayItem.completed = false;
          }
        });
      }
      state.isTemplateModalOpen = false;
    },
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
    assignWorkoutToMonthDay: (
      state,
      action: PayloadAction<{ dateString: string; workoutId: string }>
    ) => {
      const day = state.monthDays.find(
        (d) => d.dateString === action.payload.dateString
      );
      if (day) {
        day.workoutId = action.payload.workoutId;
        day.isRestDay = false;
      }
    },
    toggleMonthDayCompletion: (state, action: PayloadAction<string>) => {
      const day = state.monthDays.find((d) => d.dateString === action.payload);
      if (day) {
        day.completed = !day.completed;
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
  setActiveView,
  toggleReminderModal,
  toggleTemplateModal,
  updateReminderSettings,
  applySplitTemplate,
  assignWorkoutToDay,
  toggleRestDay,
  removeWorkoutFromDay,
  toggleDayCompletion,
  assignWorkoutToMonthDay,
  toggleMonthDayCompletion,
  openAssignModal,
  closeAssignModal,
} = plannerSlice.actions;

export default plannerSlice.reducer;
