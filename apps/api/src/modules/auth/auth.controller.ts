import type { Request, Response, NextFunction } from "express";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { User } from "../users/user.model.js";
import { config } from "../../config/env.js";
import { isDbConnected } from "../../database/db.js";
import { sendResponse } from "../../common/apiResponse.js";

// Helper to generate JWT token
const generateToken = (userId: string, email: string, name?: string): string => {
  return jwt.sign(
    { id: userId, email, name },
    config.jwtSecret,
    { expiresIn: config.jwtExpiresIn as any }
  );
};

interface MemoryAuthUser {
  _id: string;
  customId?: string;
  name: string;
  email: string;
  password?: string;
  avatarUrl?: string;
  fitnessLevel?: string;
  goal?: string;
  isOnboarded?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Pre-seed demo user with bcrypt hash of "password123" for instant local testing
const DEMO_HASHED_PASSWORD = bcryptjs.hashSync("password123", 10);

const memoryUsers: MemoryAuthUser[] = [
  {
    _id: "demo-user-1",
    customId: "demo-user-1",
    name: "Alex Hunter",
    email: "alex@fitsync.ai",
    password: DEMO_HASHED_PASSWORD,
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    fitnessLevel: "intermediate",
    goal: "Hypertrophy & Muscle Gain",
    isOnboarded: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function sanitizeUser(user: any) {
  if (!user) return user;
  const userObj = typeof user.toObject === "function" ? user.toObject() : { ...user };
  delete userObj.password;
  return userObj;
}

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { name, email, password, fitnessLevel, goal } = req.body;

    if (!name || !name.trim()) {
      sendResponse(res, 400, {
        success: false,
        message: "Full name is required.",
      });
      return;
    }

    if (!email || !email.trim()) {
      sendResponse(res, 400, {
        success: false,
        message: "Email address is required.",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      sendResponse(res, 400, {
        success: false,
        message: "Please enter a valid email address.",
      });
      return;
    }

    if (!password || password.length < 6) {
      sendResponse(res, 400, {
        success: false,
        message: "Password must be at least 6 characters long.",
      });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const hashedPassword = await bcryptjs.hash(password, 10);

    if (isDbConnected()) {
      let existingUser = await User.findOne({ email: normalizedEmail }).select("+password");

      if (existingUser && existingUser.password) {
        sendResponse(res, 400, {
          success: false,
          message: "An account with this email already exists. Please sign in.",
        });
        return;
      }

      let user;
      if (existingUser) {
        // User existed without password (e.g. from guest sync)
        existingUser.name = name.trim();
        existingUser.password = hashedPassword;
        if (fitnessLevel) existingUser.fitnessLevel = fitnessLevel;
        if (goal) existingUser.goal = goal;
        await existingUser.save();
        user = existingUser;
      } else {
        user = await User.create({
          name: name.trim(),
          email: normalizedEmail,
          password: hashedPassword,
          fitnessLevel: fitnessLevel || "intermediate",
          goal: goal || "Hypertrophy & Muscle Gain",
          isOnboarded: false,
        });
      }

      const token = generateToken(user._id.toString(), user.email, user.name);

      sendResponse(res, 201, {
        success: true,
        message: "Account created successfully",
        data: {
          user: sanitizeUser(user),
          token,
        },
      });
      return;
    }

    // In-memory resilient mode
    const existingMemUser = memoryUsers.find((u) => u.email === normalizedEmail);
    if (existingMemUser && existingMemUser.password) {
      sendResponse(res, 400, {
        success: false,
        message: "An account with this email already exists. Please sign in.",
      });
      return;
    }

    let savedUser: MemoryAuthUser;
    if (existingMemUser) {
      existingMemUser.name = name.trim();
      existingMemUser.password = hashedPassword;
      if (fitnessLevel) existingMemUser.fitnessLevel = fitnessLevel;
      if (goal) existingMemUser.goal = goal;
      existingMemUser.updatedAt = new Date().toISOString();
      savedUser = existingMemUser;
    } else {
      savedUser = {
        _id: `user-${Date.now()}`,
        customId: `user-${Date.now()}`,
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        fitnessLevel: fitnessLevel || "intermediate",
        goal: goal || "Hypertrophy & Muscle Gain",
        isOnboarded: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      memoryUsers.push(savedUser);
    }

    const token = generateToken(savedUser._id, savedUser.email, savedUser.name);

    sendResponse(res, 201, {
      success: true,
      message: "Account created successfully",
      data: {
        user: sanitizeUser(savedUser),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      sendResponse(res, 400, {
        success: false,
        message: "Email and password are required.",
      });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (isDbConnected()) {
      const user = await User.findOne({ email: normalizedEmail }).select("+password");

      if (!user) {
        sendResponse(res, 401, {
          success: false,
          message: "Invalid email or password.",
        });
        return;
      }

      if (!user.password) {
        sendResponse(res, 401, {
          success: false,
          message: "No password has been set for this account. Please sign up to create your credentials.",
        });
        return;
      }

      const isMatch = await bcryptjs.compare(password, user.password);

      if (!isMatch) {
        sendResponse(res, 401, {
          success: false,
          message: "Invalid email or password.",
        });
        return;
      }

      const token = generateToken(user._id.toString(), user.email, user.name);

      sendResponse(res, 200, {
        success: true,
        message: "Logged in successfully",
        data: {
          user: sanitizeUser(user),
          token,
        },
      });
      return;
    }

    // In-memory resilient mode
    const memUser = memoryUsers.find((u) => u.email === normalizedEmail);

    if (!memUser) {
      sendResponse(res, 401, {
        success: false,
        message: "Invalid email or password.",
      });
      return;
    }

    if (!memUser.password) {
      sendResponse(res, 401, {
        success: false,
        message: "No password has been set for this account. Please sign up to create your credentials.",
      });
      return;
    }

    const isMatch = await bcryptjs.compare(password, memUser.password);

    if (!isMatch) {
      sendResponse(res, 401, {
        success: false,
        message: "Invalid email or password.",
      });
      return;
    }

    const token = generateToken(memUser._id, memUser.email, memUser.name);

    sendResponse(res, 200, {
      success: true,
      message: "Logged in successfully",
      data: {
        user: sanitizeUser(memUser),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user?.id) {
      sendResponse(res, 401, {
        success: false,
        message: "Not authenticated",
      });
      return;
    }

    if (isDbConnected()) {
      let user = null;
      if (mongoose.Types.ObjectId.isValid(req.user.id)) {
        user = await User.findById(req.user.id);
      }
      if (!user && req.user.customId) {
        user = await User.findOne({ customId: req.user.customId });
      }
      if (!user && req.user.email) {
        user = await User.findOne({ email: req.user.email });
      }

      if (!user) {
        sendResponse(res, 404, {
          success: false,
          message: "User account not found.",
        });
        return;
      }

      sendResponse(res, 200, {
        success: true,
        message: "User profile retrieved",
        data: sanitizeUser(user),
      });
      return;
    }

    // In-memory mode
    const memUser = memoryUsers.find(
      (u) =>
        u._id === req.user?.id ||
        u.customId === req.user?.id ||
        (req.user?.email && u.email === req.user.email)
    );

    if (!memUser) {
      sendResponse(res, 404, {
        success: false,
        message: "User account not found.",
      });
      return;
    }

    sendResponse(res, 200, {
      success: true,
      message: "User profile retrieved",
      data: sanitizeUser(memUser),
    });
  } catch (error) {
    next(error);
  }
};

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

    const normalizedEmail = email.toLowerCase().trim();

    if (isDbConnected()) {
      let user = await User.findOne({ email: normalizedEmail });

      if (!user) {
        user = await User.create({
          name: name.trim(),
          email: normalizedEmail,
          avatarUrl,
          fitnessLevel: fitnessLevel || "beginner",
          goal: goal || "Build Muscle & Strength",
          isOnboarded: false,
        });
      }

      const token = generateToken(user._id.toString(), user.email, user.name);

      sendResponse(res, 200, {
        success: true,
        message: "User synced successfully",
        data: {
          user: sanitizeUser(user),
          token,
        },
      });
      return;
    }

    // In-memory fallback
    let memUser = memoryUsers.find((u) => u.email === normalizedEmail);

    if (!memUser) {
      memUser = {
        _id: `user-${Date.now()}`,
        customId: `user-${Date.now()}`,
        name: name.trim(),
        email: normalizedEmail,
        avatarUrl,
        fitnessLevel: fitnessLevel || "beginner",
        goal: goal || "Build Muscle & Strength",
        isOnboarded: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      memoryUsers.push(memUser);
    }

    const token = generateToken(memUser._id, memUser.email, memUser.name);

    sendResponse(res, 200, {
      success: true,
      message: "User synced successfully",
      data: {
        user: sanitizeUser(memUser),
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

