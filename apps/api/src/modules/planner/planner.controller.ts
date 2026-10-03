import type { Request, Response } from "express";
import { Planner } from "./planner.model.js";
import {
  defaultWeekSchedule,
  generateDefaultMonthDays,
  defaultReminderConfig,
  type SeedDaySchedule,
  type SeedCalendarDayEntry,
  type SeedReminderConfig,
} from "./planner.seed.js";
import { sendResponse } from "../../common/apiResponse.js";
import { isDbConnected } from "../../database/db.js";

// In-memory fallback store
const memoryPlannerStore = new Map<string, any>();

function getOrCreateMemoryPlanner(userId: string) {
  if (!memoryPlannerStore.has(userId)) {
    memoryPlannerStore.set(userId, {
      userId,
      schedule: JSON.parse(JSON.stringify(defaultWeekSchedule)),
      monthDays: generateDefaultMonthDays(),
      reminderSettings: { ...defaultReminderConfig },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  return memoryPlannerStore.get(userId);
}

/**
 * GET /api/planner/:userId
 * Retrieves user's complete planner state: 7-day schedule, month days, and reminder config.
 */
export async function getPlanner(req: Request, res: Response): Promise<void> {
  try {
    const userId = String(req.params.userId);

    if (!isDbConnected()) {
      const planner = getOrCreateMemoryPlanner(userId);
      sendResponse(res, 200, {
        success: true,
        message: "Planner retrieved from fallback store",
        data: planner,
      });
      return;
    }

    let planner = await Planner.findOne({ userId });

    if (!planner) {
      planner = await Planner.create({
        userId,
        schedule: defaultWeekSchedule,
        monthDays: generateDefaultMonthDays(),
        reminderSettings: defaultReminderConfig,
      });
    }

    sendResponse(res, 200, {
      success: true,
      message: "Planner retrieved successfully",
      data: planner,
    });
  } catch (error) {
    sendResponse(res, 500, {
      success: false,
      message: "Failed to retrieve planner data",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * PUT /api/planner/:userId/schedule
 * Updates the 7-day microcycle schedule
 */
export async function updateSchedule(req: Request, res: Response): Promise<void> {
  try {
    const userId = String(req.params.userId);
    const { schedule } = req.body as { schedule: SeedDaySchedule[] };

    if (!schedule || !Array.isArray(schedule)) {
      sendResponse(res, 400, {
        success: false,
        message: "Invalid schedule data: array expected",
      });
      return;
    }

    if (!isDbConnected()) {
      const planner = getOrCreateMemoryPlanner(userId);
      planner.schedule = schedule;
      planner.updatedAt = new Date().toISOString();
      sendResponse(res, 200, {
        success: true,
        message: "Schedule updated in memory fallback",
        data: planner,
      });
      return;
    }

    const planner = await Planner.findOneAndUpdate(
      { userId },
      { $set: { schedule } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    sendResponse(res, 200, {
      success: true,
      message: "Weekly schedule updated successfully",
      data: planner,
    });
  } catch (error) {
    sendResponse(res, 500, {
      success: false,
      message: "Failed to update weekly schedule",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * PUT /api/planner/:userId/month-day
 * Updates a single calendar day entry (e.g. assigning workout, toggling rest, completing)
 */
export async function updateMonthDay(req: Request, res: Response): Promise<void> {
  try {
    const userId = String(req.params.userId);
    const dayData = req.body as Partial<SeedCalendarDayEntry> & { dateString: string };

    if (!dayData || !dayData.dateString) {
      sendResponse(res, 400, {
        success: false,
        message: "dateString is required",
      });
      return;
    }

    if (!isDbConnected()) {
      const planner = getOrCreateMemoryPlanner(userId);
      const idx = planner.monthDays.findIndex(
        (d: SeedCalendarDayEntry) => d.dateString === dayData.dateString
      );
      if (idx !== -1) {
        planner.monthDays[idx] = { ...planner.monthDays[idx], ...dayData };
      } else {
        planner.monthDays.push(dayData);
      }
      planner.updatedAt = new Date().toISOString();
      sendResponse(res, 200, {
        success: true,
        message: "Month day updated in memory fallback",
        data: planner,
      });
      return;
    }

    let planner = await Planner.findOne({ userId });
    if (!planner) {
      planner = await Planner.create({
        userId,
        schedule: defaultWeekSchedule,
        monthDays: generateDefaultMonthDays(),
        reminderSettings: defaultReminderConfig,
      });
    }

    const dayIndex = planner.monthDays.findIndex(
      (d) => d.dateString === dayData.dateString
    );

    if (dayIndex !== -1) {
      Object.assign(planner.monthDays[dayIndex], dayData);
    } else {
      planner.monthDays.push(dayData as SeedCalendarDayEntry);
    }

    planner.markModified("monthDays");
    await planner.save();

    sendResponse(res, 200, {
      success: true,
      message: "Month calendar day updated successfully",
      data: planner,
    });
  } catch (error) {
    sendResponse(res, 500, {
      success: false,
      message: "Failed to update calendar day",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * PUT /api/planner/:userId/reminders
 * Updates reminder settings
 */
export async function updateReminders(req: Request, res: Response): Promise<void> {
  try {
    const userId = String(req.params.userId);
    const reminders = req.body as Partial<SeedReminderConfig>;

    if (!isDbConnected()) {
      const planner = getOrCreateMemoryPlanner(userId);
      planner.reminderSettings = { ...planner.reminderSettings, ...reminders };
      planner.updatedAt = new Date().toISOString();
      sendResponse(res, 200, {
        success: true,
        message: "Reminders updated in fallback store",
        data: planner.reminderSettings,
      });
      return;
    }

    const planner = await Planner.findOneAndUpdate(
      { userId },
      { $set: { reminderSettings: reminders } },
      { new: true, upsert: true }
    );

    sendResponse(res, 200, {
      success: true,
      message: "Reminder settings updated successfully",
      data: planner?.reminderSettings,
    });
  } catch (error) {
    sendResponse(res, 500, {
      success: false,
      message: "Failed to update reminder settings",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * POST /api/planner/:userId/apply-template
 * Applies a split template to the weekly schedule
 */
export async function applyTemplate(req: Request, res: Response): Promise<void> {
  try {
    const userId = String(req.params.userId);
    const { scheduleMap } = req.body as {
      templateId?: string;
      scheduleMap: Record<string, { workoutId: string | null; isRestDay: boolean; notes: string }>;
    };

    if (!scheduleMap) {
      sendResponse(res, 400, {
        success: false,
        message: "scheduleMap is required",
      });
      return;
    }

    const applyToSchedule = (currentSchedule: SeedDaySchedule[]) => {
      return currentSchedule.map((item) => {
        const mapping = scheduleMap[item.day];
        if (mapping) {
          return {
            ...item,
            workoutId: mapping.workoutId,
            isRestDay: mapping.isRestDay,
            notes: mapping.notes,
            completed: false,
          };
        }
        return item;
      });
    };

    if (!isDbConnected()) {
      const planner = getOrCreateMemoryPlanner(userId);
      planner.schedule = applyToSchedule(planner.schedule);
      planner.updatedAt = new Date().toISOString();
      sendResponse(res, 200, {
        success: true,
        message: "Split template applied in fallback store",
        data: planner,
      });
      return;
    }

    let planner = await Planner.findOne({ userId });
    if (!planner) {
      planner = await Planner.create({
        userId,
        schedule: defaultWeekSchedule,
        monthDays: generateDefaultMonthDays(),
        reminderSettings: defaultReminderConfig,
      });
    }

    planner.schedule = applyToSchedule(planner.schedule);
    planner.markModified("schedule");
    await planner.save();

    sendResponse(res, 200, {
      success: true,
      message: "Split template applied successfully",
      data: planner,
    });
  } catch (error) {
    sendResponse(res, 500, {
      success: false,
      message: "Failed to apply split template",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
