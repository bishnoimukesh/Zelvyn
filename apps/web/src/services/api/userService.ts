import { apiClient } from "./apiClient";
import type { User } from "@/types";

export const userService = {
  /**
   * Fetch user profile by ID, custom ID, or email
   */
  async getUserProfile(userId: string): Promise<User> {
    return apiClient.get<User>(`/users/${encodeURIComponent(userId)}`);
  },

  /**
   * Update profile fields and biometrics in MongoDB
   */
  async updateUserProfile(userId: string, updates: Partial<User>): Promise<User> {
    return apiClient.put<User>(`/users/${encodeURIComponent(userId)}`, updates);
  },

  /**
   * Complete onboarding and persist preferences
   */
  async completeOnboarding(userId: string, data: Partial<User>): Promise<User> {
    return apiClient.put<User>(`/users/${encodeURIComponent(userId)}`, {
      ...data,
      isOnboarded: true,
    });
  },

  /**
   * Get all registered users
   */
  async getAllUsers(): Promise<User[]> {
    return apiClient.get<User[]>("/users");
  },
};
