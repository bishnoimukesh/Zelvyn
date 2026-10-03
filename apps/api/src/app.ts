import express, { type Application } from "express";
import cors from "cors";
import morgan from "morgan";
import { config } from "./config/env.js";
import { getDbStatus } from "./database/db.js";
import { sendResponse } from "./common/apiResponse.js";
import { notFoundHandler } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/users/user.routes.js";
import workoutRoutes from "./modules/workouts/workout.routes.js";
import logRoutes from "./modules/logs/log.routes.js";
import plannerRoutes from "./modules/planner/planner.routes.js";
import videoRoutes from "./modules/videos/video.routes.js";
import coachRoutes from "./modules/coach/coach.routes.js";
import progressRoutes from "./modules/progress/progress.routes.js";
import nutritionRoutes from "./modules/nutrition/nutrition.routes.js";
import habitsRoutes from "./modules/habits/habits.routes.js";

const app: Application = express();

// Global Middlewares
app.use(
  cors({
    origin: config.clientOrigin,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (config.nodeEnv !== "test") {
  app.use(morgan("dev"));
}

// Health Check
app.get("/api/health", (_req, res) => {
  sendResponse(res, 200, {
    success: true,
    message: "FitSync API is healthy and operational",
    data: {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: getDbStatus(),
    },
  });
});

// Root ping
app.get("/", (_req, res) => {
  res.json({
    name: "FitSync API",
    status: "active",
    version: "1.0.0",
    health: "/api/health",
  });
});

// API Modules
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/logs", logRoutes);
app.use("/api/planner", plannerRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/coach", coachRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/nutrition", nutritionRoutes);
app.use("/api/habits", habitsRoutes);

// 404 Catch-all
app.use(notFoundHandler);

// Centralized Error Handler
app.use(errorHandler);

export default app;
