import { Router } from "express";
import { registerOrSyncUser } from "./auth.controller.js";

const router = Router();

router.post("/sync", registerOrSyncUser);

export default router;
