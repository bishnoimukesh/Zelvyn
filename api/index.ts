import type { Request, Response } from "express";
import app from "../apps/api/src/app.js";
import { connectDB } from "../apps/api/src/database/db.js";

export default async function handler(req: Request, res: Response): Promise<void> {
  await connectDB();
  return (app as unknown as (req: Request, res: Response) => void)(req, res);
}
