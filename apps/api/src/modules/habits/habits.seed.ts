export interface SeedHabit {
  habitId: string;
  name: string;
  current: number;
  target: number;
  unit: string;
  color: string;
  iconKey: string;
  step: number;
  streak: number;
  category: 'hydration' | 'recovery' | 'fitness' | 'activity' | 'nutrition' | 'mindfulness' | 'custom';
}

export const DEFAULT_HABITS: SeedHabit[] = [
  {
    habitId: 'water',
    name: 'Water Intake',
    current: 5,
    target: 8,
    unit: 'glasses',
    color: '#00F0FF',
    iconKey: 'Droplet',
    step: 1,
    streak: 6,
    category: 'hydration',
  },
  {
    habitId: 'sleep',
    name: 'Sleep Rest',
    current: 7.5,
    target: 8,
    unit: 'hours',
    color: '#A78BFA',
    iconKey: 'Moon',
    step: 0.5,
    streak: 4,
    category: 'recovery',
  },
  {
    habitId: 'workout',
    name: 'Workout Session',
    current: 1,
    target: 1,
    unit: 'session',
    color: '#C8FF47',
    iconKey: 'Dumbbell',
    step: 1,
    streak: 8,
    category: 'fitness',
  },
  {
    habitId: 'steps',
    name: 'Daily Steps',
    current: 7842,
    target: 10000,
    unit: 'steps',
    color: '#FF8438',
    iconKey: 'Footprints',
    step: 500,
    streak: 12,
    category: 'activity',
  },
  {
    habitId: 'protein',
    name: 'Target Protein',
    current: 145,
    target: 160,
    unit: 'g',
    color: '#FF453A',
    iconKey: 'Flame',
    step: 10,
    streak: 5,
    category: 'nutrition',
  },
  {
    habitId: 'meditation',
    name: 'Mindfulness & Meditation',
    current: 10,
    target: 10,
    unit: 'min',
    color: '#38BDF8',
    iconKey: 'Sparkles',
    step: 5,
    streak: 3,
    category: 'mindfulness',
  },
];
