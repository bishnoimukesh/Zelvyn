import { Router } from "express";
import {
  getUserProfile,
  updateUserProfile,
  getAllUsers,
} from "./user.controller.js";

const router = Router();

router.get("/", getAllUsers);
router.get("/:id", getUserProfile);
router.put("/:id", updateUserProfile);

export default router;
