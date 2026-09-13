export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  fitnessLevel?: "beginner" | "intermediate" | "advanced";
  height?: number;
  weight?: number;
  targetWeight?: number;
}

export interface Workout {
  id: string;
  title: string;
  category: "strength" | "hiit" | "cardio" | "mobility";
  duration: number; // in minutes
  calories: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  thumbnail: string;
  videoUrl?: string;
}

export interface FitnessGoal {
  id: string;
  title: string;
  target: number;
  current: number;
  unit: string;
}

export interface ProgressEntry {
  date: string;
  weight: number;
  caloriesBurned: number;
  steps: number;
  activeMinutes: number;
}
