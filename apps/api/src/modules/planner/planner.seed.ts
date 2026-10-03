export interface SeedDaySchedule {
  day: string;
  shortDay: string;
  isRestDay: boolean;
  workoutId: string | null;
  completed?: boolean;
  notes?: string;
}

export interface SeedCalendarDayEntry {
  dateString: string;
  dayNumber: number;
  dayName: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  workoutId: string | null;
  completed?: boolean;
  isRestDay?: boolean;
  notes?: string;
}

export interface SeedReminderConfig {
  enabled: boolean;
  time: string;
  leadTimeMinutes: number;
  notifyRestDays: boolean;
  pushPermission: "default" | "granted" | "denied";
}

export const defaultWeekSchedule: SeedDaySchedule[] = [
  {
    day: "Monday",
    shortDay: "MON",
    isRestDay: false,
    workoutId: "w-2",
    completed: true,
    notes: "Upper body push & pull compound focus",
  },
  {
    day: "Tuesday",
    shortDay: "TUE",
    isRestDay: false,
    workoutId: "w-4",
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
    workoutId: "w-6",
    completed: true,
    notes: "Overhead press and arm supersets",
  },
  {
    day: "Friday",
    shortDay: "FRI",
    isRestDay: false,
    workoutId: "w-1",
    completed: false,
    notes: "Metabolic conditioning circuit",
  },
  {
    day: "Saturday",
    shortDay: "SAT",
    isRestDay: false,
    workoutId: "w-7",
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

export const generateDefaultMonthDays = (): SeedCalendarDayEntry[] => {
  const days: SeedCalendarDayEntry[] = [];
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

export const defaultReminderConfig: SeedReminderConfig = {
  enabled: true,
  time: "07:30",
  leadTimeMinutes: 15,
  notifyRestDays: true,
  pushPermission: "default",
};
