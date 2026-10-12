import { Router } from "express";
import {
  signup,
  login,
  getMe,
  registerOrSyncUser,
} from "./auth.controller.js";
import { requireAuth } from "../../middleware/auth.js";

const router = Router();

router.post("/signup", signup);
router.post("/register", signup);
router.post("/login", login);
router.get("/me", requireAuth, getMe);
router.post("/sync", registerOrSyncUser);

export default router;
