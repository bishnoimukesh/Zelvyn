import { apiClient, ApiResponse } from "./apiClient";

export interface HabitItem {
  _id?: string;
  userId: string;
  habitId: string;
  name: string;
  current: number;
  target: number;
  unit: string;
  color: string;
  iconKey: string;
  step: number;
  streak: number;
  category: string;
  lastUpdatedDate?: string;
  history?: Array<{
    date: string;
    value: number;
    completed: boolean;
  }>;
}

export const habitsService = {
  /**
   * Fetch user's habits and streaks
   */
  async getHabits(userId: string = "default_user"): Promise<{ data: HabitItem[]; source?: string }> {
    const res = await apiClient.get<any>(`/habits?userId=${userId}`);
    const items: HabitItem[] = Array.isArray(res) ? res : Array.isArray(res?.data) ? res.data : [];
    return {
      data: items,
      source: res?.source || "mongodb",
    };
  },

  /**
   * Update habit progress (increment, decrement, or set exact value)
   */
  async updateProgress(params: {
    userId?: string;
    habitId: string;
    delta?: number;
    value?: number;
  }): Promise<HabitItem> {
    const res = await apiClient.post<ApiResponse<HabitItem>>("/habits/progress", {
      userId: params.userId || "default_user",
      habitId: params.habitId,
      delta: params.delta,
      value: params.value,
    });
    return res.data;
  },

  /**
   * Add a new custom habit
   */
  async addCustomHabit(params: {
    userId?: string;
    name: string;
    target: number;
    unit: string;
    color?: string;
    iconKey?: string;
    step?: number;
    category?: string;
  }): Promise<HabitItem> {
    const res = await apiClient.post<ApiResponse<HabitItem>>("/habits/custom", {
      userId: params.userId || "default_user",
      ...params,
    });
    return res.data;
  },

  /**
   * Delete habit
   */
  async deleteHabit(habitId: string, userId: string = "default_user"): Promise<void> {
    await apiClient.delete<ApiResponse<{ message: string }>>(`/habits/${habitId}?userId=${userId}`);
  },
};
