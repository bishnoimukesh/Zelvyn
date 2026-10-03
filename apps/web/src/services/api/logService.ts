import { apiClient } from "./apiClient";
import type { CompletedWorkoutLog } from "@/types";

export interface WorkoutStatsSummary {
  totalWorkouts: number;
  totalMinutes: number;
  totalCalories: number;
  totalVolumeKg: number;
  weeklyActivity: Array<{
    day: string;
    calories: number;
    duration: number;
    completed: boolean;
    isToday: boolean;
  }>;
  recentLogs: CompletedWorkoutLog[];
}

export const logService = {
  /**
   * Log a completed workout session to the backend database
   */
  async logWorkout(log: {
    userId: string;
    workoutId?: string;
    workoutTitle: string;
    category?: string;
    durationMinutes: number;
    totalVolumeKg?: number;
    caloriesBurned?: number;
    setsCompleted?: number;
    totalSets?: number;
    date?: string;
  }): Promise<CompletedWorkoutLog> {
    return apiClient.post<CompletedWorkoutLog>("/logs", log);
  },

  /**
   * Get all completed workout logs for a given user
   */
  async getUserWorkoutLogs(userId: string): Promise<CompletedWorkoutLog[]> {
    return apiClient.get<CompletedWorkoutLog[]>(`/logs/user/${encodeURIComponent(userId)}`);
  },

  /**
   * Get aggregated activity summary and weekly breakdown
   */
  async getUserStatsSummary(userId: string): Promise<WorkoutStatsSummary> {
    return apiClient.get<WorkoutStatsSummary>(
      `/logs/user/${encodeURIComponent(userId)}/summary`
    );
  },

  /**
   * Delete a specific workout log
   */
  async deleteWorkoutLog(logId: string): Promise<void> {
    return apiClient.delete<void>(`/logs/${encodeURIComponent(logId)}`);
  },
};
