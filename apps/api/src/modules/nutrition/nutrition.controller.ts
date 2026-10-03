import type { Request, Response } from "express";
import { Nutrition } from "./nutrition.model.js";
import { initialSeedMeals, type SeedMealItem } from "./nutrition.seed.js";
import { sendResponse } from "../../common/apiResponse.js";
import { isDbConnected } from "../../database/db.js";

// In-memory fallback store
const memoryNutritionStore = new Map<string, any>();

function getOrCreateMemoryNutrition(userId: string) {
  if (!memoryNutritionStore.has(userId)) {
    memoryNutritionStore.set(userId, {
      userId,
      targetCalories: 1771,
      targetProtein: 164,
      targetCarbs: 177,
      targetFat: 49,
      consumedCalories: 1180,
      consumedProtein: 112,
      consumedCarbs: 130,
      consumedFat: 34,
      meals: JSON.parse(JSON.stringify(initialSeedMeals)),
      loggedMealIds: ["m-1", "m-2"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  return memoryNutritionStore.get(userId);
}

/**
 * GET /api/nutrition/:userId
 * Retrieves user's complete nutrition profile, targets, meals, and logged entries
 */
export async function getNutrition(req: Request, res: Response): Promise<void> {
  try {
    const userId = String(req.params.userId);

    if (!isDbConnected()) {
      const record = getOrCreateMemoryNutrition(userId);
      sendResponse(res, 200, {
        success: true,
        message: "Nutrition retrieved from fallback store",
        data: record,
      });
      return;
    }

    let nutrition = await Nutrition.findOne({ userId });
    if (!nutrition) {
      nutrition = await Nutrition.create({
        userId,
        targetCalories: 1771,
        targetProtein: 164,
        targetCarbs: 177,
        targetFat: 49,
        consumedCalories: 1180,
        consumedProtein: 112,
        consumedCarbs: 130,
        consumedFat: 34,
        meals: initialSeedMeals,
        loggedMealIds: ["m-1", "m-2"],
      });
    }

    sendResponse(res, 200, {
      success: true,
      message: "Nutrition retrieved successfully",
      data: nutrition,
    });
  } catch (error) {
    sendResponse(res, 500, {
      success: false,
      message: "Failed to fetch nutrition data",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * POST /api/nutrition/:userId/log-meal
 * Logs a meal into today's consumed macros
 */
export async function logMeal(req: Request, res: Response): Promise<void> {
  try {
    const userId = String(req.params.userId);
    const { mealId } = req.body as { mealId?: string };

    if (!mealId) {
      sendResponse(res, 400, { success: false, message: "mealId is required" });
      return;
    }

    if (!isDbConnected()) {
      const record = getOrCreateMemoryNutrition(userId);
      const meal = record.meals.find((m: SeedMealItem) => m.id === mealId);
      if (meal && !record.loggedMealIds.includes(mealId)) {
        record.loggedMealIds.push(mealId);
        record.consumedCalories += meal.calories;
        record.consumedProtein += meal.protein;
        record.consumedCarbs += meal.carbs;
        record.consumedFat += meal.fat;
      }
      sendResponse(res, 200, {
        success: true,
        message: "Meal logged in fallback store",
        data: record,
      });
      return;
    }

    let nutrition = await Nutrition.findOne({ userId });
    if (!nutrition) {
      nutrition = await Nutrition.create({
        userId,
        meals: initialSeedMeals,
        loggedMealIds: [],
      });
    }

    const meal = nutrition.meals.find((m) => m.id === mealId);
    if (meal && !nutrition.loggedMealIds.includes(mealId)) {
      nutrition.loggedMealIds.push(mealId);
      nutrition.consumedCalories += meal.calories;
      nutrition.consumedProtein += meal.protein;
      nutrition.consumedCarbs += meal.carbs;
      nutrition.consumedFat += meal.fat;

      nutrition.markModified("loggedMealIds");
      await nutrition.save();
    }

    sendResponse(res, 200, {
      success: true,
      message: "Meal logged successfully",
      data: nutrition,
    });
  } catch (error) {
    sendResponse(res, 500, {
      success: false,
      message: "Failed to log meal",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * DELETE /api/nutrition/:userId/log-meal/:mealId
 * Removes a meal from today's consumed macros
 */
export async function unlogMeal(req: Request, res: Response): Promise<void> {
  try {
    const userId = String(req.params.userId);
    const mealId = String(req.params.mealId);

    if (!isDbConnected()) {
      const record = getOrCreateMemoryNutrition(userId);
      const meal = record.meals.find((m: SeedMealItem) => m.id === mealId);
      if (meal && record.loggedMealIds.includes(mealId)) {
        record.loggedMealIds = record.loggedMealIds.filter((id: string) => id !== mealId);
        record.consumedCalories = Math.max(0, record.consumedCalories - meal.calories);
        record.consumedProtein = Math.max(0, record.consumedProtein - meal.protein);
        record.consumedCarbs = Math.max(0, record.consumedCarbs - meal.carbs);
        record.consumedFat = Math.max(0, record.consumedFat - meal.fat);
      }
      sendResponse(res, 200, {
        success: true,
        message: "Meal unlogged in fallback store",
        data: record,
      });
      return;
    }

    const nutrition = await Nutrition.findOne({ userId });
    if (!nutrition) {
      sendResponse(res, 404, { success: false, message: "Nutrition record not found" });
      return;
    }

    const meal = nutrition.meals.find((m) => m.id === mealId);
    if (meal && nutrition.loggedMealIds.includes(mealId)) {
      nutrition.loggedMealIds = nutrition.loggedMealIds.filter((id) => id !== mealId);
      nutrition.consumedCalories = Math.max(0, nutrition.consumedCalories - meal.calories);
      nutrition.consumedProtein = Math.max(0, nutrition.consumedProtein - meal.protein);
      nutrition.consumedCarbs = Math.max(0, nutrition.consumedCarbs - meal.carbs);
      nutrition.consumedFat = Math.max(0, nutrition.consumedFat - meal.fat);

      nutrition.markModified("loggedMealIds");
      await nutrition.save();
    }

    sendResponse(res, 200, {
      success: true,
      message: "Meal removed from log",
      data: nutrition,
    });
  } catch (error) {
    sendResponse(res, 500, {
      success: false,
      message: "Failed to remove meal from log",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * POST /api/nutrition/:userId/custom-meal
 * Adds a new custom meal or AI-generated meal to the user's meal catalogue
 */
export async function addCustomMeal(req: Request, res: Response): Promise<void> {
  try {
    const userId = String(req.params.userId);
    const mealData = req.body as Partial<SeedMealItem>;

    if (!mealData.title || !mealData.calories) {
      sendResponse(res, 400, { success: false, message: "title and calories are required" });
      return;
    }

    const newMeal: SeedMealItem = {
      id: mealData.id || `custom-${Date.now()}`,
      title: mealData.title,
      category: mealData.category || "Lunch",
      calories: mealData.calories,
      protein: mealData.protein || 0,
      carbs: mealData.carbs || 0,
      fat: mealData.fat || 0,
      ingredients: mealData.ingredients || [],
    };

    if (!isDbConnected()) {
      const record = getOrCreateMemoryNutrition(userId);
      record.meals.push(newMeal);
      sendResponse(res, 201, {
        success: true,
        message: "Custom meal added in fallback store",
        data: { meal: newMeal, nutrition: record },
      });
      return;
    }

    let nutrition = await Nutrition.findOne({ userId });
    if (!nutrition) {
      nutrition = await Nutrition.create({
        userId,
        meals: initialSeedMeals,
      });
    }

    nutrition.meals.push(newMeal);
    nutrition.markModified("meals");
    await nutrition.save();

    sendResponse(res, 201, {
      success: true,
      message: "Custom meal added successfully",
      data: { meal: newMeal, nutrition },
    });
  } catch (error) {
    sendResponse(res, 500, {
      success: false,
      message: "Failed to add custom meal",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * PUT /api/nutrition/:userId/targets
 * Updates daily macro and calorie targets
 */
export async function updateTargets(req: Request, res: Response): Promise<void> {
  try {
    const userId = String(req.params.userId);
    const { targetCalories, targetProtein, targetCarbs, targetFat } = req.body;

    if (!isDbConnected()) {
      const record = getOrCreateMemoryNutrition(userId);
      if (targetCalories) record.targetCalories = targetCalories;
      if (targetProtein) record.targetProtein = targetProtein;
      if (targetCarbs) record.targetCarbs = targetCarbs;
      if (targetFat) record.targetFat = targetFat;
      sendResponse(res, 200, {
        success: true,
        message: "Nutrition targets updated in fallback store",
        data: record,
      });
      return;
    }

    const update: Record<string, any> = {};
    if (targetCalories) update.targetCalories = targetCalories;
    if (targetProtein) update.targetProtein = targetProtein;
    if (targetCarbs) update.targetCarbs = targetCarbs;
    if (targetFat) update.targetFat = targetFat;

    const nutrition = await Nutrition.findOneAndUpdate(
      { userId },
      { $set: update },
      { new: true, upsert: true }
    );

    sendResponse(res, 200, {
      success: true,
      message: "Nutrition targets updated successfully",
      data: nutrition,
    });
  } catch (error) {
    sendResponse(res, 500, {
      success: false,
      message: "Failed to update targets",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
