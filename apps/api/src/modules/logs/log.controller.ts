import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { WorkoutLog } from "./log.model.js";
import { sendResponse } from "../../common/apiResponse.js";

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
    } = req.body;

    if (!userId || !workoutTitle || !durationMinutes) {
      sendResponse(res, 400, {
        success: false,
        message: "userId, workoutTitle, and durationMinutes are required.",
      });
      return;
    }

    const log = await WorkoutLog.create({
      userId,
      workoutId,
      workoutTitle,
      category: category || "strength",
      durationMinutes,
      totalVolumeKg: totalVolumeKg || 0,
      caloriesBurned: caloriesBurned || 0,
      setsCompleted: setsCompleted || 0,
      totalSets: totalSets || 0,
      date: new Date(),
    });

    sendResponse(res, 201, {
      success: true,
      message: "Workout logged successfully",
      data: log,
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

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      sendResponse(res, 400, {
        success: false,
        message: "Invalid user ID format",
      });
      return;
    }

    const logs = await WorkoutLog.find({ userId }).sort({ date: -1 });

    sendResponse(res, 200, {
      success: true,
      data: logs,
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

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      sendResponse(res, 400, {
        success: false,
        message: "Invalid user ID format",
      });
      return;
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const stats = await WorkoutLog.aggregate([
      { $match: { userId: userObjectId } },
      {
        $group: {
          _id: null,
          totalWorkouts: { $sum: 1 },
          totalMinutes: { $sum: "$durationMinutes" },
          totalCalories: { $sum: "$caloriesBurned" },
          totalVolumeKg: { $sum: "$totalVolumeKg" },
        },
      },
    ]);

    sendResponse(res, 200, {
      success: true,
      data: stats[0] || {
        totalWorkouts: 0,
        totalMinutes: 0,
        totalCalories: 0,
        totalVolumeKg: 0,
      },
    });
  } catch (error) {
    next(error);
  }
};
