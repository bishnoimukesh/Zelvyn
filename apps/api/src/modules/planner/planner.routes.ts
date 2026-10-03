import { Router } from "express";
import {
  getPlanner,
  updateSchedule,
  updateMonthDay,
  updateReminders,
  applyTemplate,
} from "./planner.controller.js";

const router = Router();

router.get("/:userId", getPlanner);
router.put("/:userId/schedule", updateSchedule);
router.put("/:userId/month-day", updateMonthDay);
router.put("/:userId/reminders", updateReminders);
router.post("/:userId/apply-template", applyTemplate);

export default router;
