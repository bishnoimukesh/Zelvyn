export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  fitnessLevel?: "beginner" | "intermediate" | "advanced";
  height?: number; // in cm
  weight?: number; // in kg
  targetWeight?: number; // in kg
  age?: number;
  gender?: "male" | "female" | "other";
  activityLevel?: "sedentary" | "light" | "moderate" | "very_active";
  goal?: string;
  isOnboarded?: boolean;
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
