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
  category: "strength" | "hiit" | "cardio" | "mobility" | "power";
  targetGoal?: "hypertrophy" | "fat_loss" | "endurance" | "strength";
  duration: number; // in minutes
  calories: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  equipment?: "bodyweight" | "dumbbell" | "barbell" | "cables" | "kettlebell";
  bodyPart?: "full_body" | "chest" | "back" | "legs" | "core" | "arms";
  exercisesCount?: number;
  thumbnail: string;
  videoUrl?: string;
  description?: string;
  exercises?: Exercise[];
}

export interface Exercise {
  id: string;
  name: string;
  targetMuscle: string;
  equipment: string;
  sets: number;
  reps: string;
  restSeconds: number;
  instructions: string[];
  formCues: string[];
  thumbnail: string;
}

export interface SetLog {
  setNumber: number;
  targetReps: string;
  actualReps: number;
  weightKg: number;
  completed: boolean;
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
