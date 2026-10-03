import { Router } from "express";
import {
  logWorkoutCompletion,
  getUserWorkoutLogs,
  getUserStatsSummary,
} from "./log.controller.js";

const router = Router();

router.post("/", logWorkoutCompletion);
router.get("/user/:userId", getUserWorkoutLogs);
router.get("/user/:userId/summary", getUserStatsSummary);

export default router;
