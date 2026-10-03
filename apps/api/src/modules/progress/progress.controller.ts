import type { Request, Response } from "express";
import { Progress } from "./progress.model.js";
import { User } from "../users/user.model.js";
import { WorkoutLog } from "../logs/log.model.js";
import {
  initialWeightLogs,
  initialStepDistribution,
  initialBadges,
  type SeedWeightLog,
} from "./progress.seed.js";
import { sendResponse } from "../../common/apiResponse.js";
import { isDbConnected } from "../../database/db.js";

// In-memory fallback
const memoryProgressStore = new Map<string, any>();

function getOrCreateMemoryProgress(userId: string) {
  if (!memoryProgressStore.has(userId)) {
    memoryProgressStore.set(userId, {
      userId,
      weightStarting: 73.5,
      weightTarget: 68.0,
      weightHistory: JSON.parse(JSON.stringify(initialWeightLogs)),
      stepTracker: {
        todaySteps: 10680,
        goalSteps: 10000,
        weeklyDistribution: initialStepDistribution,
      },
      streak: {
        current: 7,
        longest: 14,
        badges: initialBadges,
      },
      calorieTarget: 600,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  return memoryProgressStore.get(userId);
}

/**
 * GET /api/progress/:userId
 * Retrieves consolidated progress biometrics, weight trends, and workout history
 */
export async function getProgress(req: Request, res: Response): Promise<void> {
  try {
    const userId = String(req.params.userId);

    if (!isDbConnected()) {
      const progress = getOrCreateMemoryProgress(userId);
      sendResponse(res, 200, {
        success: true,
        message: "Progress retrieved from fallback store",
        data: {
          ...progress,
          workoutHistory: [],
          calorieTracker: {
            dailyTarget: 600,
            weeklyDistribution: [
              { day: "Mon", date: "Sep 07", calories: 520, target: 600 },
              { day: "Tue", date: "Sep 08", calories: 680, target: 600 },
              { day: "Wed", date: "Sep 09", calories: 340, target: 600 },
              { day: "Thu", date: "Sep 10", calories: 710, target: 600 },
              { day: "Fri", date: "Sep 11", calories: 590, target: 600 },
              { day: "Sat", date: "Sep 12", calories: 840, target: 600 },
              { day: "Sun", date: "Sep 13", calories: 420, target: 600 },
            ],
          },
        },
      });
      return;
    }

    let progress = await Progress.findOne({ userId });
    if (!progress) {
      progress = await Progress.create({
        userId,
        weightStarting: 73.5,
        weightTarget: 68.0,
        weightHistory: initialWeightLogs,
      });
    }

    // Fetch user's workout logs
    const workoutLogs = await WorkoutLog.find({ userId })
      .sort({ createdAt: -1 })
      .limit(20);

    // Compute weekly calorie distribution from logs or fallback
    const daysMap: Record<string, number> = {
      Mon: 520,
      Tue: 680,
      Wed: 340,
      Thu: 710,
      Fri: 590,
      Sat: 840,
      Sun: 420,
    };

    workoutLogs.forEach((l) => {
      const d = new Date(l.date || l.createdAt);
      const dayName = d.toLocaleDateString("en-US", { weekday: "short" });
      if (daysMap[dayName] !== undefined && l.caloriesBurned) {
        daysMap[dayName] += l.caloriesBurned;
      }
    });

    const weeklyDistribution = [
      { day: "Mon", date: "Sep 07", calories: daysMap["Mon"], target: 600 },
      { day: "Tue", date: "Sep 08", calories: daysMap["Tue"], target: 600 },
      { day: "Wed", date: "Sep 09", calories: daysMap["Wed"], target: 600 },
      { day: "Thu", date: "Sep 10", calories: daysMap["Thu"], target: 600 },
      { day: "Fri", date: "Sep 11", calories: daysMap["Fri"], target: 600 },
      { day: "Sat", date: "Sep 12", calories: daysMap["Sat"], target: 600 },
      { day: "Sun", date: "Sep 13", calories: daysMap["Sun"], target: 600 },
    ];

    sendResponse(res, 200, {
      success: true,
      message: "Progress biometrics retrieved successfully",
      data: {
        id: progress.id,
        userId: progress.userId,
        weightStarting: progress.weightStarting,
        weightTarget: progress.weightTarget,
        weightHistory: progress.weightHistory,
        stepTracker: progress.stepTracker,
        streak: progress.streak,
        workoutHistory: workoutLogs,
        calorieTracker: {
          dailyTarget: progress.calorieTarget || 600,
          weeklyDistribution,
        },
      },
    });
  } catch (error) {
    sendResponse(res, 500, {
      success: false,
      message: "Failed to retrieve progress data",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * POST /api/progress/:userId/weight
 * Logs a new weigh-in entry and updates the user's latest biometrics
 */
export async function logWeight(req: Request, res: Response): Promise<void> {
  try {
    const userId = String(req.params.userId);
    const { weight, bodyFatPercent, notes, date } = req.body as {
      weight?: number;
      bodyFatPercent?: number;
      notes?: string;
      date?: string;
    };

    if (!weight || typeof weight !== "number") {
      sendResponse(res, 400, { success: false, message: "Valid weight number is required" });
      return;
    }

    const newEntry: SeedWeightLog = {
      id: `w-${Date.now()}`,
      date: date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      weight,
      bodyFatPercent,
      notes,
    };

    if (!isDbConnected()) {
      const progress = getOrCreateMemoryProgress(userId);
      progress.weightHistory.push(newEntry);
      progress.updatedAt = new Date().toISOString();
      sendResponse(res, 200, {
        success: true,
        message: "Weight logged in fallback store",
        data: { newEntry, weightHistory: progress.weightHistory },
      });
      return;
    }

    let progress = await Progress.findOne({ userId });
    if (!progress) {
      progress = await Progress.create({
        userId,
        weightStarting: 73.5,
        weightTarget: 68.0,
        weightHistory: initialWeightLogs,
      });
    }

    progress.weightHistory.push(newEntry);
    progress.markModified("weightHistory");
    await progress.save();

    // Sync latest weight to User profile in MongoDB
    await User.findOneAndUpdate(
      { $or: [{ customId: userId }, { email: userId }] },
      { $set: { weight } }
    );

    sendResponse(res, 200, {
      success: true,
      message: "Weight logged successfully",
      data: {
        newEntry,
        weightHistory: progress.weightHistory,
      },
    });
  } catch (error) {
    sendResponse(res, 500, {
      success: false,
      message: "Failed to log weight",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
