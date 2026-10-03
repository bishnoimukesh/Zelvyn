export interface SeedAchievement {
  id: string;
  title: string;
  description: string;
  xp: number;
  unlocked: boolean;
  unlockedDate?: string;
  iconKey: string;
  color: string;
  category: 'workout' | 'streak' | 'milestone' | 'nutrition' | 'activity';
}

export interface SeedGamification {
  userId: string;
  level: number;
  title: string;
  currentXp: number;
  nextLevelXp: number;
  achievements: SeedAchievement[];
}

export const DEFAULT_ACHIEVEMENTS: SeedAchievement[] = [
  // Earned (6)
  {
    id: 'first_workout',
    title: 'First Workout',
    description: 'Complete your very first workout session',
    xp: 50,
    unlocked: true,
    unlockedDate: 'Jul 9',
    iconKey: 'Trophy',
    color: '#F59E0B',
    category: 'workout',
  },
  {
    id: 'streak_7',
    title: '7-Day Streak',
    description: 'Work out 7 consecutive days in a row',
    xp: 150,
    unlocked: true,
    unlockedDate: 'Aug 15',
    iconKey: 'Flame',
    color: '#FF8438',
    category: 'streak',
  },
  {
    id: 'steps_10k',
    title: '10K Steps',
    description: 'Hit 10,000 steps in a single active day',
    xp: 100,
    unlocked: true,
    unlockedDate: 'Aug 30',
    iconKey: 'Footprints',
    color: '#A78BFA',
    category: 'activity',
  },
  {
    id: 'new_pr',
    title: 'New PR',
    description: 'Set a new personal record in strength training',
    xp: 200,
    unlocked: true,
    unlockedDate: 'Sep 6',
    iconKey: 'TrendingUp',
    color: '#00F0FF',
    category: 'milestone',
  },
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Complete 10 high-energy morning workouts',
    xp: 150,
    unlocked: true,
    unlockedDate: 'Aug 25',
    iconKey: 'Sunrise',
    color: '#F97316',
    category: 'workout',
  },
  {
    id: 'iron_will',
    title: 'Iron Will',
    description: 'Complete a workout session with 5,000kg+ total volume',
    xp: 300,
    unlocked: true,
    unlockedDate: 'Sep 9',
    iconKey: 'Dumbbell',
    color: '#C8FF47',
    category: 'milestone',
  },
  // Locked (4)
  {
    id: 'streak_30',
    title: '30-Day Streak',
    description: 'Maintain an unbroken 30-day fitness routine',
    xp: 300,
    unlocked: false,
    iconKey: 'Zap',
    color: '#71717A',
    category: 'streak',
  },
  {
    id: 'workouts_100',
    title: '100 Workouts',
    description: 'Complete 100 total logged workout sessions',
    xp: 500,
    unlocked: false,
    iconKey: 'Trophy',
    color: '#71717A',
    category: 'workout',
  },
  {
    id: 'nutrition_tracker',
    title: 'Nutrition Tracker',
    description: 'Log target macros for 7 consecutive days',
    xp: 150,
    unlocked: false,
    iconKey: 'Flame',
    color: '#71717A',
    category: 'nutrition',
  },
  {
    id: 'century_club',
    title: 'Century Club',
    description: 'Bench press, deadlift or squat 100kg milestone',
    xp: 500,
    unlocked: false,
    iconKey: 'Dumbbell',
    color: '#71717A',
    category: 'milestone',
  },
];

export const DEFAULT_GAMIFICATION: SeedGamification = {
  userId: 'default_user',
  level: 12,
  title: 'Fitness Explorer',
  currentXp: 2480,
  nextLevelXp: 2500,
  achievements: DEFAULT_ACHIEVEMENTS,
};
