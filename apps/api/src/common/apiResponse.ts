import type { Response } from "express";

export interface ApiResponseOptions<T> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: Record<string, unknown>;
  error?: string | object;
}

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  payload: ApiResponseOptions<T>
): Response => {
  return res.status(statusCode).json(payload);
};
