import mongoose, { Schema, Document } from "mongoose";
import { initialSeedMeals, type SeedMealItem } from "./nutrition.seed.js";

export interface INutritionDocument extends Document {
  userId: string;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  consumedCalories: number;
  consumedProtein: number;
  consumedCarbs: number;
  consumedFat: number;
  meals: SeedMealItem[];
  loggedMealIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

const MealItemSchema = new Schema<SeedMealItem>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    category: {
      type: String,
      enum: ["Breakfast", "Lunch", "Dinner", "Snack"],
      required: true,
    },
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },
    ingredients: { type: [String], default: [] },
  },
  { _id: false }
);

const NutritionSchema = new Schema<INutritionDocument>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    targetCalories: { type: Number, default: 1771 },
    targetProtein: { type: Number, default: 164 },
    targetCarbs: { type: Number, default: 177 },
    targetFat: { type: Number, default: 49 },
    consumedCalories: { type: Number, default: 1180 },
    consumedProtein: { type: Number, default: 112 },
    consumedCarbs: { type: Number, default: 130 },
    consumedFat: { type: Number, default: 34 },
    meals: { type: [MealItemSchema], default: initialSeedMeals },
    loggedMealIds: { type: [String], default: ["m-1", "m-2"] },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, any>) {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform(_doc, ret: Record<string, any>) {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Nutrition = mongoose.model<INutritionDocument>("Nutrition", NutritionSchema);
