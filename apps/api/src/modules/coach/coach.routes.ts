import { Router } from "express";
import {
  getCoachHistory,
  postChatMessage,
  clearChatHistory,
} from "./coach.controller.js";

const router = Router();

router.get("/:userId", getCoachHistory);
router.post("/:userId/chat", postChatMessage);
router.delete("/:userId/history", clearChatHistory);

export default router;
