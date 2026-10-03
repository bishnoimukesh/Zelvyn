import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { nutritionService, MealItem, NutritionData } from "@/services/api/nutritionService";

interface NutritionState {
  meals: MealItem[];
  loggedMealIds: string[];
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  consumedCalories: number;
  consumedProtein: number;
  consumedCarbs: number;
  consumedFat: number;
  loading: boolean;
  isLiveSynced: boolean;
  error: string | null;
}

const initialState: NutritionState = {
  meals: [],
  loggedMealIds: [],
  targetCalories: 1771,
  targetProtein: 164,
  targetCarbs: 177,
  targetFat: 49,
  consumedCalories: 1180,
  consumedProtein: 112,
  consumedCarbs: 130,
  consumedFat: 34,
  loading: false,
  isLiveSynced: false,
  error: null,
};

// Async Thunks
export const fetchNutrition = createAsyncThunk(
  "nutrition/fetchNutrition",
  async (userId: string = "demo-user-1") => {
    return await nutritionService.getNutrition(userId);
  }
);

export const logMealAsync = createAsyncThunk(
  "nutrition/logMealAsync",
  async ({ userId = "demo-user-1", mealId }: { userId?: string; mealId: string }) => {
    return await nutritionService.logMeal(userId, mealId);
  }
);

export const unlogMealAsync = createAsyncThunk(
  "nutrition/unlogMealAsync",
  async ({ userId = "demo-user-1", mealId }: { userId?: string; mealId: string }) => {
    return await nutritionService.unlogMeal(userId, mealId);
  }
);

export const addCustomMealAsync = createAsyncThunk(
  "nutrition/addCustomMealAsync",
  async ({ userId = "demo-user-1", meal }: { userId?: string; meal: Partial<MealItem> }) => {
    return await nutritionService.addCustomMeal(userId, meal);
  }
);

export const updateTargetsAsync = createAsyncThunk(
  "nutrition/updateTargetsAsync",
  async ({ userId = "demo-user-1", targets }: { userId?: string; targets: Partial<NutritionData> }) => {
    return await nutritionService.updateTargets(userId, targets);
  }
);

export const nutritionSlice = createSlice({
  name: "nutrition",
  initialState,
  reducers: {
    toggleLocalMeal: (state, action: PayloadAction<string>) => {
      const mealId = action.payload;
      const meal = state.meals.find((m) => m.id === mealId);
      if (meal) {
        if (state.loggedMealIds.includes(mealId)) {
          state.loggedMealIds = state.loggedMealIds.filter((id) => id !== mealId);
          state.consumedCalories = Math.max(0, state.consumedCalories - meal.calories);
          state.consumedProtein = Math.max(0, state.consumedProtein - meal.protein);
          state.consumedCarbs = Math.max(0, state.consumedCarbs - meal.carbs);
          state.consumedFat = Math.max(0, state.consumedFat - meal.fat);
        } else {
          state.loggedMealIds.push(mealId);
          state.consumedCalories += meal.calories;
          state.consumedProtein += meal.protein;
          state.consumedCarbs += meal.carbs;
          state.consumedFat += meal.fat;
        }
      }
    },
  },
  extraReducers: (builder) => {
    // fetchNutrition
    builder.addCase(fetchNutrition.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchNutrition.fulfilled, (state, action) => {
      state.loading = false;
      state.isLiveSynced = true;
      if (action.payload) {
        state.meals = action.payload.meals || [];
        state.loggedMealIds = action.payload.loggedMealIds || [];
        state.targetCalories = action.payload.targetCalories;
        state.targetProtein = action.payload.targetProtein;
        state.targetCarbs = action.payload.targetCarbs;
        state.targetFat = action.payload.targetFat;
        state.consumedCalories = action.payload.consumedCalories;
        state.consumedProtein = action.payload.consumedProtein;
        state.consumedCarbs = action.payload.consumedCarbs;
        state.consumedFat = action.payload.consumedFat;
      }
    });
    builder.addCase(fetchNutrition.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to fetch nutrition";
    });

    // logMealAsync
    builder.addCase(logMealAsync.fulfilled, (state, action) => {
      state.isLiveSynced = true;
      if (action.payload) {
        state.loggedMealIds = action.payload.loggedMealIds;
        state.consumedCalories = action.payload.consumedCalories;
        state.consumedProtein = action.payload.consumedProtein;
        state.consumedCarbs = action.payload.consumedCarbs;
        state.consumedFat = action.payload.consumedFat;
      }
    });

    // unlogMealAsync
    builder.addCase(unlogMealAsync.fulfilled, (state, action) => {
      state.isLiveSynced = true;
      if (action.payload) {
        state.loggedMealIds = action.payload.loggedMealIds;
        state.consumedCalories = action.payload.consumedCalories;
        state.consumedProtein = action.payload.consumedProtein;
        state.consumedCarbs = action.payload.consumedCarbs;
        state.consumedFat = action.payload.consumedFat;
      }
    });

    // addCustomMealAsync
    builder.addCase(addCustomMealAsync.fulfilled, (state, action) => {
      state.isLiveSynced = true;
      if (action.payload?.meal) {
        state.meals.push(action.payload.meal);
      }
    });

    // updateTargetsAsync
    builder.addCase(updateTargetsAsync.fulfilled, (state, action) => {
      state.isLiveSynced = true;
      if (action.payload) {
        state.targetCalories = action.payload.targetCalories;
        state.targetProtein = action.payload.targetProtein;
        state.targetCarbs = action.payload.targetCarbs;
        state.targetFat = action.payload.targetFat;
      }
    });
  },
});

export const { toggleLocalMeal } = nutritionSlice.actions;

export default nutritionSlice.reducer;
