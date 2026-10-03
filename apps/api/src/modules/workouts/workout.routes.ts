import { Router } from "express";
import {
  getWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout,
  seedInitialWorkouts,
} from "./workout.controller.js";

const router = Router();

router.get("/seed", seedInitialWorkouts);
router.get("/", getWorkouts);
router.get("/:id", getWorkoutById);
router.post("/", createWorkout);
router.put("/:id", updateWorkout);
router.delete("/:id", deleteWorkout);

export default router;
