import { Router } from "express";
import { getProgress, logWeight } from "./progress.controller.js";

const router = Router();

router.get("/:userId", getProgress);
router.post("/:userId/weight", logWeight);

export default router;
