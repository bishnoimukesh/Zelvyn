export interface SeedWeightLog {
  id: string;
  date: string;
  weight: number;
  bodyFatPercent?: number;
  notes?: string;
}

export interface SeedDayStep {
  day: string;
  date: string;
  steps: number;
  goal: number;
}

export interface SeedStreakBadge {
  id: string;
  title: string;
  icon: string;
  description: string;
  unlocked: boolean;
}

export const initialWeightLogs: SeedWeightLog[] = [
  { id: "w-1", date: "Aug 15", weight: 72.8, bodyFatPercent: 18.2, notes: "Baseline check" },
  { id: "w-2", date: "Aug 22", weight: 72.3, bodyFatPercent: 17.9, notes: "Consistent nutrition" },
  { id: "w-3", date: "Aug 29", weight: 71.8, bodyFatPercent: 17.5, notes: "Carb cycling week" },
  { id: "w-4", date: "Sep 05", weight: 71.1, bodyFatPercent: 17.1, notes: "Deload recovery" },
  { id: "w-5", date: "Sep 12", weight: 70.4, bodyFatPercent: 16.7, notes: "High volume phase" },
  { id: "w-6", date: "Sep 19", weight: 69.9, bodyFatPercent: 16.3, notes: "Peak hypertrophy conditioning" },
];

export const initialStepDistribution: SeedDayStep[] = [
  { day: "Mon", date: "Sep 07", steps: 11420, goal: 10000 },
  { day: "Tue", date: "Sep 08", steps: 9850, goal: 10000 },
  { day: "Wed", date: "Sep 09", steps: 12300, goal: 10000 },
  { day: "Thu", date: "Sep 10", steps: 8900, goal: 10000 },
  { day: "Fri", date: "Sep 11", steps: 10450, goal: 10000 },
  { day: "Sat", date: "Sep 12", steps: 14200, goal: 10000 },
  { day: "Sun", date: "Sep 13", steps: 10680, goal: 10000 },
];

export const initialBadges: SeedStreakBadge[] = [
  { id: "b-1", title: "Iron Starter", icon: "flame", description: "Completed 3 consecutive training days", unlocked: true },
  { id: "b-2", title: "7-Day Unbroken", icon: "zap", description: "Maintained a perfect 7-day active microcycle", unlocked: true },
  { id: "b-3", title: "Century Volume", icon: "dumbbell", description: "Surpassed 100,000 kg total cumulative load", unlocked: true },
  { id: "b-4", title: "Metabolic Beast", icon: "target", description: "Burned 10,000 active calories in studio sessions", unlocked: true },
  { id: "b-5", title: "30-Day Master", icon: "crown", description: "Complete a full 30-day mesocycle without missing", unlocked: false },
];
