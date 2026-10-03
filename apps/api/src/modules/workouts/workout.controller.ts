import type { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { Workout } from "./workout.model.js";
import { isDbConnected } from "../../database/db.js";
import { initialSeedWorkouts, type SeedWorkout } from "./workout.seed.js";
import { sendResponse } from "../../common/apiResponse.js";

// In-memory persistent fallback store for rapid, decoupled local dev or when DB is offline
let memoryWorkouts: SeedWorkout[] = JSON.parse(JSON.stringify(initialSeedWorkouts));

// Auto-seed MongoDB on startup if connected and empty
let mongoSeeded = false;
async function ensureMongoSeeded() {
  if (mongoSeeded || !isDbConnected()) return;
  try {
    const count = await Workout.countDocuments();
    if (count === 0) {
      console.log("[Workouts] Seeding initial workouts to MongoDB...");
      await Workout.insertMany(initialSeedWorkouts);
      console.log("[Workouts] MongoDB successfully seeded with initial catalog.");
    }
    mongoSeeded = true;
  } catch (err) {
    console.error("[Workouts] Auto-seed error:", err);
  }
}

export const getWorkouts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { category, difficulty, equipment, bodyPart, goal, search } = req.query;

    if (isDbConnected()) {
      await ensureMongoSeeded();
      const filter: Record<string, unknown> = {};

      if (category && category !== "all" && typeof category === "string") {
        filter.category = category;
      }
      if (difficulty && difficulty !== "all" && typeof difficulty === "string") {
        filter.difficulty = difficulty;
      }
      if (equipment && equipment !== "all" && typeof equipment === "string") {
        filter.equipment = equipment;
      }
      if (bodyPart && bodyPart !== "all" && typeof bodyPart === "string") {
        filter.bodyPart = bodyPart;
      }
      if (goal && goal !== "all" && typeof goal === "string") {
        filter.targetGoal = goal;
      }
      if (search && typeof search === "string" && search.trim()) {
        const regex = { $regex: search.trim(), $options: "i" };
        filter.$or = [{ title: regex }, { description: regex }, { bodyPart: regex }];
      }

      const workouts = await Workout.find(filter).sort({ createdAt: -1 });
      sendResponse(res, 200, {
        success: true,
        data: workouts,
        meta: { total: workouts.length, source: "mongodb" },
      });
      return;
    }

    // Resilient fallback logic
    let result = [...memoryWorkouts];

    if (category && category !== "all" && typeof category === "string") {
      result = result.filter((w) => w.category === category);
    }
    if (difficulty && difficulty !== "all" && typeof difficulty === "string") {
      result = result.filter((w) => w.difficulty === difficulty);
    }
    if (equipment && equipment !== "all" && typeof equipment === "string") {
      result = result.filter((w) => w.equipment === equipment);
    }
    if (bodyPart && bodyPart !== "all" && typeof bodyPart === "string") {
      result = result.filter((w) => w.bodyPart === bodyPart);
    }
    if (goal && goal !== "all" && typeof goal === "string") {
      result = result.filter((w) => w.targetGoal === goal);
    }
    if (search && typeof search === "string" && search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (w) =>
          w.title.toLowerCase().includes(q) ||
          w.description?.toLowerCase().includes(q) ||
          w.bodyPart?.toLowerCase().includes(q)
      );
    }

    sendResponse(res, 200, {
      success: true,
      data: result,
      meta: { total: result.length, source: "in-memory" },
    });
  } catch (error) {
    next(error);
  }
};

export const getWorkoutById = async (
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
        message: "Workout ID is required",
      });
      return;
    }

    if (isDbConnected()) {
      await ensureMongoSeeded();
      const isObjectId = mongoose.Types.ObjectId.isValid(id);
      const query = isObjectId ? { $or: [{ _id: id }, { customId: id }] } : { customId: id };
      const workout = await Workout.findOne(query);

      if (!workout) {
        sendResponse(res, 404, {
          success: false,
          message: `Workout with ID '${id}' not found`,
        });
        return;
      }

      sendResponse(res, 200, {
        success: true,
        data: workout,
      });
      return;
    }

    // In-memory fallback
    const workout = memoryWorkouts.find(
      (w) => w.id === id || w.customId === id
    );

    if (!workout) {
      sendResponse(res, 404, {
        success: false,
        message: `Workout with ID '${id}' not found`,
      });
      return;
    }

    sendResponse(res, 200, {
      success: true,
      data: workout,
    });
  } catch (error) {
    next(error);
  }
};

export const createWorkout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const payload = req.body;
    if (!payload.title || !payload.category || !payload.duration) {
      sendResponse(res, 400, {
        success: false,
        message: "Title, category, and duration are required.",
      });
      return;
    }

    if (isDbConnected()) {
      const workout = await Workout.create(payload);
      sendResponse(res, 201, {
        success: true,
        message: "Workout created successfully in MongoDB",
        data: workout,
      });
      return;
    }

    const newId = `w-${Date.now()}`;
    const newWorkout: SeedWorkout = {
      ...payload,
      id: newId,
      customId: newId,
      exercisesCount: payload.exercises?.length || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    memoryWorkouts.unshift(newWorkout);

    sendResponse(res, 201, {
      success: true,
      message: "Workout created successfully",
      data: newWorkout,
    });
  } catch (error) {
    next(error);
  }
};

export const updateWorkout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    if (isDbConnected()) {
      const isObjectId = mongoose.Types.ObjectId.isValid(id);
      const query = isObjectId ? { $or: [{ _id: id }, { customId: id }] } : { customId: id };
      const updated = await Workout.findOneAndUpdate(query, req.body, {
        new: true,
        runValidators: true,
      });

      if (!updated) {
        sendResponse(res, 404, {
          success: false,
          message: "Workout not found",
        });
        return;
      }

      sendResponse(res, 200, {
        success: true,
        message: "Workout updated successfully",
        data: updated,
      });
      return;
    }

    const idx = memoryWorkouts.findIndex((w) => w.id === id || w.customId === id);
    if (idx === -1) {
      sendResponse(res, 404, {
        success: false,
        message: "Workout not found",
      });
      return;
    }

    memoryWorkouts[idx] = {
      ...memoryWorkouts[idx],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    sendResponse(res, 200, {
      success: true,
      message: "Workout updated successfully",
      data: memoryWorkouts[idx],
    });
  } catch (error) {
    next(error);
  }
};

export const deleteWorkout = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const rawId = req.params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    if (isDbConnected()) {
      const isObjectId = mongoose.Types.ObjectId.isValid(id);
      const query = isObjectId ? { $or: [{ _id: id }, { customId: id }] } : { customId: id };
      const deleted = await Workout.findOneAndDelete(query);

      if (!deleted) {
        sendResponse(res, 404, {
          success: false,
          message: "Workout not found",
        });
        return;
      }

      sendResponse(res, 200, {
        success: true,
        message: "Workout deleted successfully",
      });
      return;
    }

    const initialLen = memoryWorkouts.length;
    memoryWorkouts = memoryWorkouts.filter((w) => w.id !== id && w.customId !== id);

    if (memoryWorkouts.length === initialLen) {
      sendResponse(res, 404, {
        success: false,
        message: "Workout not found",
      });
      return;
    }

    sendResponse(res, 200, {
      success: true,
      message: "Workout deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const seedInitialWorkouts = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    memoryWorkouts = JSON.parse(JSON.stringify(initialSeedWorkouts));

    if (isDbConnected()) {
      await Workout.deleteMany({});
      const inserted = await Workout.insertMany(initialSeedWorkouts);
      sendResponse(res, 201, {
        success: true,
        message: `Successfully seeded ${inserted.length} workouts into MongoDB`,
        data: inserted,
      });
      return;
    }

    sendResponse(res, 200, {
      success: true,
      message: `Reset in-memory catalog with ${memoryWorkouts.length} seeded workouts.`,
      data: memoryWorkouts,
    });
  } catch (error) {
    next(error);
  }
};
