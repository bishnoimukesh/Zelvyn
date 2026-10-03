import { apiClient, ApiResponse } from "./apiClient";
import {
  WeightLogEntry,
  CompletedWorkoutLog,
  ActivityHeatmapDay,
} from "@/types";
import { StreakBadge, DayStepRecord, DayCalorieRecord } from "@/features/progress/progressSlice";

export interface ProgressResponseData {
  userId: string;
  weightStarting: number;
  weightTarget: number;
  weightHistory: WeightLogEntry[];
  stepTracker: {
    todaySteps: number;
    goalSteps: number;
    weeklyDistribution: DayStepRecord[];
  };
  streak: {
    current: number;
    longest: number;
    badges: StreakBadge[];
  };
  workoutHistory: CompletedWorkoutLog[];
  activityHeatmap?: ActivityHeatmapDay[];
  calorieTracker: {
    dailyTarget: number;
    weeklyDistribution: DayCalorieRecord[];
  };
}

export const progressService = {
  /**
   * Fetch consolidated progress, weigh-ins, workout history, and streak
   */
  async getProgress(userId: string): Promise<ProgressResponseData> {
    const res = await apiClient.get<ApiResponse<ProgressResponseData>>(`/progress/${userId}`);
    return res.data;
  },

  /**
   * Log a new weight entry
   */
  async logWeight(
    userId: string,
    entry: {
      weight: number;
      bodyFatPercent?: number;
      notes?: string;
      date?: string;
    }
  ): Promise<{ newEntry: WeightLogEntry; weightHistory: WeightLogEntry[] }> {
    const res = await apiClient.post<
      ApiResponse<{ newEntry: WeightLogEntry; weightHistory: WeightLogEntry[] }>
    >(`/progress/${userId}/weight`, entry);
    return res.data;
  },
};
