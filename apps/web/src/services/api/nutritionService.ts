import { apiClient, ApiResponse } from "./apiClient";

export interface MealItem {
  id: string;
  title: string;
  category: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
}

export interface NutritionData {
  userId: string;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  consumedCalories: number;
  consumedProtein: number;
  consumedCarbs: number;
  consumedFat: number;
  meals: MealItem[];
  loggedMealIds: string[];
}

export const nutritionService = {
  /**
   * Fetch user's nutrition data, meals and targets
   */
  async getNutrition(userId: string): Promise<NutritionData> {
    const res = await apiClient.get<ApiResponse<NutritionData>>(`/nutrition/${userId}`);
    return res.data;
  },

  /**
   * Log a meal into today's consumption
   */
  async logMeal(userId: string, mealId: string): Promise<NutritionData> {
    const res = await apiClient.post<ApiResponse<NutritionData>>(
      `/nutrition/${userId}/log-meal`,
      { mealId }
    );
    return res.data;
  },

  /**
   * Unlog a meal from today's consumption
   */
  async unlogMeal(userId: string, mealId: string): Promise<NutritionData> {
    const res = await apiClient.delete<ApiResponse<NutritionData>>(
      `/nutrition/${userId}/log-meal/${mealId}`
    );
    return res.data;
  },

  /**
   * Add a custom or AI-generated meal
   */
  async addCustomMeal(userId: string, meal: Partial<MealItem>): Promise<{ meal: MealItem; nutrition: NutritionData }> {
    const res = await apiClient.post<ApiResponse<{ meal: MealItem; nutrition: NutritionData }>>(
      `/nutrition/${userId}/custom-meal`,
      meal
    );
    return res.data;
  },

  /**
   * Update macro and calorie targets
   */
  async updateTargets(userId: string, targets: Partial<NutritionData>): Promise<NutritionData> {
    const res = await apiClient.put<ApiResponse<NutritionData>>(
      `/nutrition/${userId}/targets`,
      targets
    );
    return res.data;
  },
};
