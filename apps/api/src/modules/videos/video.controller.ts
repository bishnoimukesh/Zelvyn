import type { Request, Response } from "express";
import mongoose from "mongoose";
import { Video } from "./video.model.js";
import { initialSeedVideos, type SeedWorkoutVideo } from "./video.seed.js";
import { sendResponse } from "../../common/apiResponse.js";
import { isDbConnected } from "../../database/db.js";

// In-memory fallback store
let memoryVideos: SeedWorkoutVideo[] = JSON.parse(JSON.stringify(initialSeedVideos));
const memoryBookmarks: Record<string, Set<string>> = {}; // videoId -> Set of userIds

async function ensureVideosSeeded(): Promise<void> {
  if (!isDbConnected()) return;
  const count = await Video.countDocuments();
  if (count === 0) {
    await Video.insertMany(initialSeedVideos);
  }
}

/**
 * GET /api/videos
 * Retrieves list of workout videos with optional filtering
 */
export async function getVideos(req: Request, res: Response): Promise<void> {
  try {
    const { category, difficulty, search, userId } = req.query as {
      category?: string;
      difficulty?: string;
      search?: string;
      userId?: string;
    };

    if (!isDbConnected()) {
      let filtered = [...memoryVideos];
      if (category && category !== "all") {
        filtered = filtered.filter((v) => v.category === category);
      }
      if (difficulty && difficulty !== "all") {
        filtered = filtered.filter((v) => v.difficulty === difficulty);
      }
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (v) =>
            v.title.toLowerCase().includes(q) ||
            v.trainer.name.toLowerCase().includes(q) ||
            v.equipment.toLowerCase().includes(q)
        );
      }

      const bookmarkedIds: string[] = [];
      if (userId) {
        for (const [vidId, users] of Object.entries(memoryBookmarks)) {
          if (users.has(userId)) bookmarkedIds.push(vidId);
        }
      }

      sendResponse(res, 200, {
        success: true,
        message: "Videos retrieved from fallback store",
        data: {
          items: filtered,
          total: filtered.length,
          bookmarkedIds,
        },
      });
      return;
    }

    await ensureVideosSeeded();

    const query: Record<string, any> = {};
    if (category && category !== "all") {
      query.category = category;
    }
    if (difficulty && difficulty !== "all") {
      query.difficulty = difficulty;
    }
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { "trainer.name": { $regex: search, $options: "i" } },
        { equipment: { $regex: search, $options: "i" } },
      ];
    }

    const videos = await Video.find(query).sort({ isFeatured: -1, rating: -1 });

    const bookmarkedIds: string[] = [];
    if (userId) {
      videos.forEach((v) => {
        if (v.bookmarkedBy && v.bookmarkedBy.includes(userId)) {
          bookmarkedIds.push(v.customId || v.id);
        }
      });
    }

    sendResponse(res, 200, {
      success: true,
      message: "Videos retrieved successfully",
      data: {
        items: videos,
        total: videos.length,
        bookmarkedIds,
      },
    });
  } catch (error) {
    sendResponse(res, 500, {
      success: false,
      message: "Failed to fetch videos",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * GET /api/videos/:id
 * Retrieves a single video by ID
 */
export async function getVideoById(req: Request, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);

    if (!isDbConnected()) {
      const found = memoryVideos.find((v) => v.id === id || v.customId === id);
      if (!found) {
        sendResponse(res, 404, { success: false, message: "Video not found" });
        return;
      }
      sendResponse(res, 200, { success: true, data: found });
      return;
    }

    await ensureVideosSeeded();

    const query = mongoose.Types.ObjectId.isValid(id)
      ? { $or: [{ _id: id }, { customId: id }] }
      : { customId: id };

    const video = await Video.findOne(query);
    if (!video) {
      sendResponse(res, 404, { success: false, message: "Video not found" });
      return;
    }

    sendResponse(res, 200, { success: true, data: video });
  } catch (error) {
    sendResponse(res, 500, {
      success: false,
      message: "Failed to fetch video",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * POST /api/videos/:id/bookmark
 * Toggles bookmark status for a user
 */
export async function toggleBookmark(req: Request, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);
    const { userId } = req.body as { userId?: string };

    if (!userId) {
      sendResponse(res, 400, { success: false, message: "userId is required" });
      return;
    }

    if (!isDbConnected()) {
      if (!memoryBookmarks[id]) {
        memoryBookmarks[id] = new Set<string>();
      }
      const isBookmarked = memoryBookmarks[id].has(userId);
      if (isBookmarked) {
        memoryBookmarks[id].delete(userId);
      } else {
        memoryBookmarks[id].add(userId);
      }
      sendResponse(res, 200, {
        success: true,
        message: isBookmarked ? "Bookmark removed" : "Video bookmarked",
        data: { videoId: id, isBookmarked: !isBookmarked },
      });
      return;
    }

    const query = mongoose.Types.ObjectId.isValid(id)
      ? { $or: [{ _id: id }, { customId: id }] }
      : { customId: id };

    const video = await Video.findOne(query);
    if (!video) {
      sendResponse(res, 404, { success: false, message: "Video not found" });
      return;
    }

    const isBookmarked = video.bookmarkedBy.includes(userId);
    if (isBookmarked) {
      video.bookmarkedBy = video.bookmarkedBy.filter((u) => u !== userId);
    } else {
      video.bookmarkedBy.push(userId);
    }
    await video.save();

    sendResponse(res, 200, {
      success: true,
      message: isBookmarked ? "Bookmark removed" : "Video bookmarked",
      data: { videoId: video.customId || video.id, isBookmarked: !isBookmarked },
    });
  } catch (error) {
    sendResponse(res, 500, {
      success: false,
      message: "Failed to toggle bookmark",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
