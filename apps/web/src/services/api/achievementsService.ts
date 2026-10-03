import { apiClient, ApiResponse } from "./apiClient";

export interface AchievementItem {
  id: string;
  title: string;
  description: string;
  xp: number;
  unlocked: boolean;
  unlockedDate?: string;
  iconKey: string;
  color: string;
  category: string;
}

export interface GamificationData {
  userId: string;
  level: number;
  title: string;
  currentXp: number;
  nextLevelXp: number;
  achievements: AchievementItem[];
}

export const achievementsService = {
  /**
   * Fetch user gamification, level, XP, and achievements
   */
  async getGamification(userId: string = "demo-user-1"): Promise<{ data: GamificationData; source?: string }> {
    const res = await apiClient.get<any>(`/achievements/${userId}`);
    const data: GamificationData = res?.achievements ? res : (res?.data || res);
    return {
      data,
      source: res?.source || "mongodb",
    };
  },

  /**
   * Unlock an achievement for the user
   */
  async unlockAchievement(userId: string, achievementId: string): Promise<GamificationData> {
    const res = await apiClient.post<ApiResponse<GamificationData>>(
      `/achievements/${userId}/unlock`,
      { achievementId }
    );
    return res.data;
  },

  /**
   * Add XP to the user
   */
  async addXp(userId: string, xp: number): Promise<GamificationData> {
    const res = await apiClient.post<ApiResponse<GamificationData>>(
      `/achievements/${userId}/xp`,
      { xp }
    );
    return res.data;
  },
};
