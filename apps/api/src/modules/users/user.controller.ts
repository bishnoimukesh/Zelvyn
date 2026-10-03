import type { Request, Response, NextFunction } from "express";
import { User } from "./user.model.js";
import { sendResponse } from "../../common/apiResponse.js";

export const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;
    const user = await User.findById(id);

    if (!user) {
      sendResponse(res, 404, {
        success: false,
        message: "User not found",
      });
      return;
    }

    sendResponse(res, 200, {
      success: true,
      data: user,
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
    const updated = await User.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      sendResponse(res, 404, {
        success: false,
        message: "User not found",
      });
      return;
    }

    sendResponse(res, 200, {
      success: true,
      message: "Profile updated successfully",
      data: updated,
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
    const users = await User.find().sort({ createdAt: -1 });
    sendResponse(res, 200, {
      success: true,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};
