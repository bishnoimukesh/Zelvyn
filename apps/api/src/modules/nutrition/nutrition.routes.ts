import { Router } from "express";
import {
  getNutrition,
  logMeal,
  unlogMeal,
  addCustomMeal,
  updateTargets,
} from "./nutrition.controller.js";

const router = Router();

router.get("/:userId", getNutrition);
router.post("/:userId/log-meal", logMeal);
router.delete("/:userId/log-meal/:mealId", unlogMeal);
router.post("/:userId/custom-meal", addCustomMeal);
router.put("/:userId/targets", updateTargets);

export default router;
