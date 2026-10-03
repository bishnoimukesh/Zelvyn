import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { User } from "./user.model.js";
import { isDbConnected } from "../../database/db.js";
import { sendResponse } from "../../common/apiResponse.js";

const defaultDemoUser = {
  customId: "demo-user-1",
  name: "Alex Hunter",
  email: "alex@fitsync.ai",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
  fitnessLevel: "intermediate",
  height: 175,
  weight: 70,
  targetWeight: 67,
  age: 26,
  gender: "male",
  activityLevel: "moderate",
  goal: "Hypertrophy & Muscle Gain",
  isOnboarded: true,
};

let memoryUser = {
  ...defaultDemoUser,
  id: "demo-user-1",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

let userSeeded = false;
async function ensureUserSeeded() {
  if (userSeeded || !isDbConnected()) return;
  try {
    const existing = await User.findOne({
      $or: [{ customId: "demo-user-1" }, { email: "alex@fitsync.ai" }],
    });
    if (!existing) {
      await User.create(defaultDemoUser);
      console.log("[Users] Seeded initial demo user into MongoDB.");
    }
    userSeeded = true;
  } catch (err) {
    console.error("[Users] Seed user error:", err);
  }
}

export const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    if (!id) {
      sendResponse(res, 400, {
        success: false,
        message: "User ID is required",
      });
      return;
    }

    if (isDbConnected()) {
      await ensureUserSeeded();
      const isObjectId = mongoose.Types.ObjectId.isValid(id);
      const query = isObjectId
        ? { $or: [{ _id: id }, { customId: id }, { email: id.toLowerCase() }] }
        : { $or: [{ customId: id }, { email: id.toLowerCase() }] };

      let user = await User.findOne(query);

      // If requested user is demo-user-1 or not found, return demo user
      if (!user && (id === "demo-user-1" || id === "me")) {
        user = await User.create(defaultDemoUser);
      }

      if (!user) {
        sendResponse(res, 404, {
          success: false,
          message: `User with ID '${id}' not found`,
        });
        return;
      }

      sendResponse(res, 200, {
        success: true,
        data: user,
      });
      return;
    }

    // In-memory fallback
    sendResponse(res, 200, {
      success: true,
      data: memoryUser,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    if (!id) {
      sendResponse(res, 400, {
        success: false,
        message: "User ID is required",
      });
      return;
    }

    if (isDbConnected()) {
      await ensureUserSeeded();
      const isObjectId = mongoose.Types.ObjectId.isValid(id);
      const query = isObjectId
        ? { $or: [{ _id: id }, { customId: id }, { email: id.toLowerCase() }] }
        : { $or: [{ customId: id }, { email: id.toLowerCase() }] };

      const updateData = {
        ...req.body,
        customId: isObjectId ? undefined : id,
      };

      const updated = await User.findOneAndUpdate(query, updateData, {
        new: true,
        upsert: true,
        runValidators: true,
      });

      sendResponse(res, 200, {
        success: true,
        message: "User profile updated successfully in MongoDB",
        data: updated,
      });
      return;
    }

    // In-memory fallback
    memoryUser = {
      ...memoryUser,
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    sendResponse(res, 200, {
      success: true,
      message: "Profile updated successfully",
      data: memoryUser,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (isDbConnected()) {
      await ensureUserSeeded();
      const users = await User.find().sort({ createdAt: -1 });
      sendResponse(res, 200, {
        success: true,
        data: users,
      });
      return;
    }

    sendResponse(res, 200, {
      success: true,
      data: [memoryUser],
    });
  } catch (error) {
    next(error);
  }
};
