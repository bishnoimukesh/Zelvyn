import type { Request, Response, NextFunction } from "express";
import { User } from "../users/user.model.js";
import { sendResponse } from "../../common/apiResponse.js";

export const registerOrSyncUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, name, avatarUrl, fitnessLevel, goal } = req.body;

    if (!email || !name) {
      sendResponse(res, 400, {
        success: false,
        message: "Email and Name are required fields.",
      });
      return;
    }

    let user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      user = await User.create({
        name,
        email: email.toLowerCase(),
        avatarUrl,
        fitnessLevel: fitnessLevel || "beginner",
        goal: goal || "Build Muscle & Strength",
        isOnboarded: false,
      });
    }

    sendResponse(res, 200, {
      success: true,
      message: "User synced successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};
