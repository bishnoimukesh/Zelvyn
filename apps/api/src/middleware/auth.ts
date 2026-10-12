import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
import { sendResponse } from "../common/apiResponse.js";

export interface AuthJwtPayload {
  id: string;
  email: string;
  name?: string;
  customId?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthJwtPayload;
    }
  }
}

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    sendResponse(res, 401, {
      success: false,
      message: "Authentication required. No token provided.",
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as AuthJwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    sendResponse(res, 401, {
      success: false,
      message: "Invalid or expired token. Please log in again.",
    });
  }
};

export const optionalAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as AuthJwtPayload;
      req.user = decoded;
    } catch {
      // Ignore token verification errors for optional auth
    }
  }

  next();
};
