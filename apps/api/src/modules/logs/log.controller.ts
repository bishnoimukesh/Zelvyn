import type { Request, Response, NextFunction } from "express";
import { WorkoutLog } from "./log.model.js";
import { isDbConnected } from "../../database/db.js";
import { sendResponse } from "../../common/apiResponse.js";

// In-memory fallback if database is offline
const memoryLogs: any[] = [];

// Seed sample historical logs for demonstration if DB is empty
const sampleHistoricalLogs = [
  {
    userId: "demo-user-1",
    workoutId: "w-2",
    workoutTitle: "Hypertrophy Chest & Back",
    category: "strength",
    durationMinutes: 45,
    totalVolumeKg: 4200,
    caloriesBurned: 410,
    setsCompleted: 14,
    totalSets: 14,
    date: new Date(Date.now() - 86400000 * 4), // 4 days ago
  },
  {
    userId: "demo-user-1",
    workoutId: "w-1",
    workoutTitle: "Full Body HIIT Ignition",
    category: "hiit",
    durationMinutes: 25,
    totalVolumeKg: 1850,
    caloriesBurned: 340,
    setsCompleted: 11,
    totalSets: 11,
    date: new Date(Date.now() - 86400000 * 3), // 3 days ago
  },
  {
    userId: "demo-user-1",
    workoutId: "w-4",
    workoutTitle: "Quads & Hamstrings Annihilation",
    category: "strength",
    durationMinutes: 50,
    totalVolumeKg: 5800,
    caloriesBurned: 480,
    setsCompleted: 11,
    totalSets: 11,
    date: new Date(Date.now() - 86400000 * 2), // 2 days ago
  },
  {
    userId: "demo-user-1",
    workoutId: "w-6",
    workoutTitle: "Shoulder Boulders & Arms Blast",
    category: "strength",
    durationMinutes: 35,
    totalVolumeKg: 3100,
    caloriesBurned: 310,
    setsCompleted: 9,
    totalSets: 9,
    date: new Date(Date.now() - 86400000 * 1), // yesterday
  },
];

let seededHistoricalLogs = false;
async function ensureSampleLogsSeeded() {
  if (seededHistoricalLogs || !isDbConnected()) return;
  try {
    const count = await WorkoutLog.countDocuments();
    if (count === 0) {
      await WorkoutLog.insertMany(sampleHistoricalLogs);
      console.log("[Logs] Seeded initial workout history logs into MongoDB.");
    }
    seededHistoricalLogs = true;
  } catch (err) {
    console.error("[Logs] Seed logs error:", err);
  }
}

export const logWorkoutCompletion = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      userId,
      workoutId,
      workoutTitle,
      category,
      durationMinutes,
      totalVolumeKg,
      caloriesBurned,
      setsCompleted,
      totalSets,
      date,
    } = req.body;

    if (!userId || !workoutTitle || !durationMinutes) {
      sendResponse(res, 400, {
        success: false,
        message: "userId, workoutTitle, and durationMinutes are required.",
      });
      return;
    }

    const logPayload = {
      userId: String(userId),
      workoutId: workoutId ? String(workoutId) : "",
      workoutTitle,
      category: category || "strength",
      durationMinutes: Number(durationMinutes),
      totalVolumeKg: Number(totalVolumeKg || 0),
      caloriesBurned: Number(caloriesBurned || 0),
      setsCompleted: Number(setsCompleted || 0),
      totalSets: Number(totalSets || 0),
      date: date ? new Date(date) : new Date(),
    };

    if (isDbConnected()) {
      const log = await WorkoutLog.create(logPayload);
      sendResponse(res, 201, {
        success: true,
        message: "Workout logged successfully in MongoDB",
        data: log,
      });
      return;
    }

    // In-memory fallback
    const memoryLog = {
      ...logPayload,
      id: `log-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    memoryLogs.unshift(memoryLog);

    sendResponse(res, 201, {
      success: true,
      message: "Workout logged successfully",
      data: memoryLog,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserWorkoutLogs = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const rawUserId = req.params.userId;
    const userId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId;

    if (!userId) {
      sendResponse(res, 400, {
        success: false,
        message: "User ID is required",
      });
      return;
    }

    if (isDbConnected()) {
      await ensureSampleLogsSeeded();
      const logs = await WorkoutLog.find({ userId: String(userId) }).sort({ date: -1 });

      sendResponse(res, 200, {
        success: true,
        data: logs,
        meta: { total: logs.length, source: "mongodb" },
      });
      return;
    }

    const filtered = memoryLogs.filter((l) => l.userId === String(userId));
    sendResponse(res, 200, {
      success: true,
      data: filtered,
      meta: { total: filtered.length, source: "in-memory" },
    });
  } catch (error) {
    next(error);
  }
};

export const getUserStatsSummary = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const rawUserId = req.params.userId;
    const userId = Array.isArray(rawUserId) ? rawUserId[0] : rawUserId;

    if (!userId) {
      sendResponse(res, 400, {
        success: false,
        message: "User ID is required",
      });
      return;
    }

    if (isDbConnected()) {
      await ensureSampleLogsSeeded();
      const userLogs = await WorkoutLog.find({ userId: String(userId) }).sort({ date: 1 });

      let totalWorkouts = userLogs.length;
      let totalMinutes = 0;
      let totalCalories = 0;
      let totalVolumeKg = 0;

      // Group by day of week for weekly chart
      const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const weeklyMap: Record<string, { calories: number; duration: number; count: number }> = {
        Mon: { calories: 0, duration: 0, count: 0 },
        Tue: { calories: 0, duration: 0, count: 0 },
        Wed: { calories: 0, duration: 0, count: 0 },
        Thu: { calories: 0, duration: 0, count: 0 },
        Fri: { calories: 0, duration: 0, count: 0 },
        Sat: { calories: 0, duration: 0, count: 0 },
        Sun: { calories: 0, duration: 0, count: 0 },
      };

      const todayIndex = new Date().getDay();
      const todayName = dayNames[todayIndex];

      userLogs.forEach((l) => {
        totalMinutes += l.durationMinutes;
        totalCalories += l.caloriesBurned;
        totalVolumeKg += l.totalVolumeKg;

        const dName = dayNames[new Date(l.date).getDay()];
        if (weeklyMap[dName]) {
          weeklyMap[dName].calories += l.caloriesBurned;
          weeklyMap[dName].duration += l.durationMinutes;
          weeklyMap[dName].count += 1;
        }
      });

      const weeklyActivity = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => ({
        day: d,
        calories: weeklyMap[d].calories,
        duration: weeklyMap[d].duration,
        completed: weeklyMap[d].count > 0,
        isToday: d === todayName,
      }));

      sendResponse(res, 200, {
        success: true,
        data: {
          totalWorkouts,
          totalMinutes,
          totalCalories,
          totalVolumeKg,
          weeklyActivity,
          recentLogs: userLogs.slice(-5).reverse(),
        },
      });
      return;
    }

    // In-memory fallback
    const userLogs = memoryLogs.filter((l) => l.userId === String(userId));
    let totalMinutes = 0;
    let totalCalories = 0;
    let totalVolumeKg = 0;

    userLogs.forEach((l) => {
      totalMinutes += l.durationMinutes;
      totalCalories += l.caloriesBurned;
      totalVolumeKg += l.totalVolumeKg;
    });

    sendResponse(res, 200, {
      success: true,
      data: {
        totalWorkouts: userLogs.length,
        totalMinutes,
        totalCalories,
        totalVolumeKg,
        weeklyActivity: [],
        recentLogs: userLogs.slice(-5),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const deleteWorkoutLog = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    if (isDbConnected()) {
      const deleted = await WorkoutLog.findByIdAndDelete(id);
      if (!deleted) {
        sendResponse(res, 404, {
          success: false,
          message: "Workout log not found",
        });
        return;
      }
      sendResponse(res, 200, {
        success: true,
        message: "Workout log deleted successfully",
      });
      return;
    }

    const idx = memoryLogs.findIndex((l) => l.id === id);
    if (idx >= 0) {
      memoryLogs.splice(idx, 1);
    }
    sendResponse(res, 200, {
      success: true,
      message: "Workout log deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
