import type { Request, Response } from "express";
import { sendResponse } from "../common/apiResponse.js";

export const notFoundHandler = (req: Request, res: Response): void => {
  sendResponse(res, 404, {
    success: false,
    message: `Resource not found at ${req.originalUrl}`,
  });
};
