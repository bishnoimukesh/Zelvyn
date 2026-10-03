import type { Request, Response, NextFunction } from "express";
import { config } from "../config/env.js";
import { sendResponse } from "../common/apiResponse.js";

export interface CustomError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: CustomError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error(`[Error] ${statusCode} - ${message}`);
  if (config.nodeEnv === "development" && err.stack) {
    console.error(err.stack);
  }

  sendResponse(res, statusCode, {
    success: false,
    message,
    ...(config.nodeEnv === "development" ? { error: err.stack } : {}),
  });
};
