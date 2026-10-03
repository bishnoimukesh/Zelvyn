import type { Request, Response, NextFunction } from "express";
import { Workout } from "./workout.model.js";
import { sendResponse } from "../../common/apiResponse.js";

export const getWorkouts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { category, difficulty, search } = req.query;

    const filter: Record<string, unknown> = {};

    if (category && typeof category === "string") {
      filter.category = category;
    }

    if (difficulty && typeof difficulty === "string") {
      filter.difficulty = difficulty;
    }

    if (search && typeof search === "string") {
      filter.title = { $regex: search, $options: "i" };
    }

    const workouts = await Workout.find(filter).sort({ createdAt: -1 });

    sendResponse(res, 200, {
      success: true,
      data: workouts,
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
    const workout = await Workout.findById(id);

    if (!workout) {
      sendResponse(res, 404, {
        success: false,
        message: "Workout not found",
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
    const workout = await Workout.create(req.body);
    sendResponse(res, 201, {
      success: true,
      message: "Workout created successfully",
      data: workout,
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
    const updated = await Workout.findByIdAndUpdate(id, req.body, {
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
    const deleted = await Workout.findByIdAndDelete(id);

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
    const sampleWorkouts = [
      {
        title: "Upper Body Hypertrophy Blast",
        category: "strength",
        targetGoal: "hypertrophy",
        duration: 45,
        calories: 380,
        difficulty: "intermediate",
        equipment: "dumbbell",
        bodyPart: "chest",
        thumbnail: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80",
        description: "Intense chest, shoulder, and tricep focus designed for muscle density.",
        exercises: [
          {
            name: "Incline Dumbbell Press",
            targetMuscle: "Upper Chest",
            equipment: "dumbbell",
            sets: 4,
            reps: "10-12",
            restSeconds: 90,
            instructions: ["Set bench to 30 degrees", "Lower weights with control to chest level", "Press up explosively"],
            formCues: ["Keep shoulder blades retracted", "Squeeze chest at top"],
          },
          {
            name: "Overhead Dumbbell Extension",
            targetMuscle: "Triceps",
            equipment: "dumbbell",
            sets: 3,
            reps: "12-15",
            restSeconds: 60,
            instructions: ["Hold dumbbell overhead with both hands", "Lower behind head while keeping elbows stationary", "Extend back to top"],
            formCues: ["Do not flare elbows outward"],
          }
        ],
      },
      {
        title: "Neon HIIT Conditioning",
        category: "hiit",
        targetGoal: "fat_loss",
        duration: 30,
        calories: 420,
        difficulty: "advanced",
        equipment: "bodyweight",
        bodyPart: "full_body",
        thumbnail: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80",
        description: "High-octane interval circuits to elevate heart rate and maximize VO2 max.",
        exercises: [
          {
            name: "Burpee Broad Jumps",
            targetMuscle: "Full Body",
            equipment: "bodyweight",
            sets: 4,
            reps: "45 sec on / 15 sec rest",
            restSeconds: 45,
            instructions: ["Drop into chest-to-deck burpee", "Pop up into a wide broad jump", "Turn around and repeat"],
            formCues: ["Soft landing on knees", "Engage core during pushup"],
          }
        ],
      },
      {
        title: "Full Body Mobility & Core Reset",
        category: "mobility",
        targetGoal: "endurance",
        duration: 25,
        calories: 180,
        difficulty: "beginner",
        equipment: "bodyweight",
        bodyPart: "full_body",
        thumbnail: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80",
        description: "Dynamic hip opener flows and isometric core stabilizing movements for optimal recovery.",
        exercises: [
          {
            name: "World's Greatest Stretch",
            targetMuscle: "Hips, Thoracic Spine",
            equipment: "bodyweight",
            sets: 3,
            reps: "8 per side",
            restSeconds: 30,
            instructions: ["Lunge forward", "Place hands inside front foot", "Reach elbow down then rotate torso toward ceiling"],
            formCues: ["Keep back leg extended", "Follow hand with eyes during rotation"],
          }
        ],
      }
    ];

    await Workout.deleteMany({});
    const inserted = await Workout.insertMany(sampleWorkouts);

    sendResponse(res, 201, {
      success: true,
      message: `Successfully seeded ${inserted.length} workouts into MongoDB`,
      data: inserted,
    });
  } catch (error) {
    next(error);
  }
};
