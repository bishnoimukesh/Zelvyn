import { apiClient } from "./apiClient";
import type { Workout } from "@/types";

export interface WorkoutFilterQuery {
  [key: string]: unknown;
  category?: string;
  difficulty?: string;
  equipment?: string;
  bodyPart?: string;
  goal?: string;
  search?: string;
}

export const workoutService = {
  /**
   * Fetch all workouts with optional server-side filter params
   */
  async getWorkouts(filters?: WorkoutFilterQuery): Promise<Workout[]> {
    return apiClient.get<Workout[]>("/workouts", filters);
  },

  /**
   * Fetch a single workout by id or customId
   */
  async getWorkoutById(id: string): Promise<Workout> {
    return apiClient.get<Workout>(`/workouts/${encodeURIComponent(id)}`);
  },

  /**
   * Create a new custom workout in backend
   */
  async createWorkout(workout: Partial<Workout>): Promise<Workout> {
    return apiClient.post<Workout>("/workouts", workout);
  },

  /**
   * Update an existing workout
   */
  async updateWorkout(id: string, updates: Partial<Workout>): Promise<Workout> {
    return apiClient.put<Workout>(`/workouts/${encodeURIComponent(id)}`, updates);
  },

  /**
   * Delete a workout
   */
  async deleteWorkout(id: string): Promise<void> {
    return apiClient.delete<void>(`/workouts/${encodeURIComponent(id)}`);
  },

  /**
   * Trigger backend initial re-seeding
   */
  async seedWorkouts(): Promise<Workout[]> {
    return apiClient.post<Workout[]>("/workouts/seed");
  },
};
