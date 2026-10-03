import { Router } from "express";
import {
  logWorkoutCompletion,
  getUserWorkoutLogs,
  getUserStatsSummary,
  deleteWorkoutLog,
} from "./log.controller.js";

const router = Router();

router.post("/", logWorkoutCompletion);
router.get("/user/:userId", getUserWorkoutLogs);
router.get("/user/:userId/summary", getUserStatsSummary);
router.delete("/:id", deleteWorkoutLog);

export default router;
