import { Router } from "express";
import { getVideos, getVideoById, toggleBookmark } from "./video.controller.js";

const router = Router();

router.get("/", getVideos);
router.get("/:id", getVideoById);
router.post("/:id/bookmark", toggleBookmark);

export default router;
