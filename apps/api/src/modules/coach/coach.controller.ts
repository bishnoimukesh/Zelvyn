import type { Request, Response } from "express";
import { Coach, defaultWelcomeMessage, type ICoachMessage } from "./coach.model.js";
import { sendResponse } from "../../common/apiResponse.js";
import { isDbConnected } from "../../database/db.js";

// In-memory fallback store
const memoryCoachStore = new Map<string, any>();

function getOrCreateMemoryCoach(userId: string) {
  if (!memoryCoachStore.has(userId)) {
    memoryCoachStore.set(userId, {
      userId,
      messages: [{ ...defaultWelcomeMessage }],
      readinessScore: 88,
      fatigueLevel: "optimal",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }
  return memoryCoachStore.get(userId);
}

/**
 * Intelligent sports science response generator
 */
function generateAthleticResponse(prompt: string): {
  text: string;
  category: "general" | "workout" | "recovery" | "nutrition";
  generatedWorkout?: any;
  suggestedPrompts?: string[];
} {
  const p = prompt.toLowerCase();

  // HIIT / Core workout request
  if (p.includes("hiit") || p.includes("burner") || p.includes("quick workout")) {
    return {
      category: "workout",
      text: "I've structured a high-density **25-Min HIIT Core & Metabolic Ignition** routine targeting maximum EPOC (Excess Post-Exercise Oxygen Consumption) while preserving lean tissue mass. Perform each station with 40s maximum effort followed by 20s recovery.",
      generatedWorkout: {
        id: `ai-hiit-${Date.now()}`,
        title: "25-Min HIIT Core & Metabolic Ignition",
        category: "hiit",
        targetGoal: "fat_loss",
        duration: 25,
        calories: 310,
        difficulty: "intermediate",
        equipment: "bodyweight",
        bodyPart: "full_body",
        exercisesCount: 5,
        thumbnail: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800",
        description: "High-density interval circuit combining rotational core anti-flexion and explosive cardiovascular output.",
        exercises: [
          {
            id: "ex-1",
            name: "Plyometric Hollow Tuck Jumps",
            targetMuscle: "Cardio & Hip Flexors",
            equipment: "Bodyweight",
            sets: 4,
            reps: "40s work",
            restSeconds: 20,
            instructions: ["Explode vertically bringing knees to chest", "Land with soft knees and transition immediately"],
            formCues: ["Engage core throughout flight phase"],
            thumbnail: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=400",
          },
          {
            id: "ex-2",
            name: "Bear Plank Cross-Knee Taps",
            targetMuscle: "Obliques & Rectus Abdominis",
            equipment: "Bodyweight",
            sets: 4,
            reps: "40s work",
            restSeconds: 20,
            instructions: ["Hover knees 1 inch above turf in quadruped stance", "Tap alternating knees to opposite elbows"],
            formCues: ["Do not allow pelvis to sway"],
            thumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=400",
          },
          {
            id: "ex-3",
            name: "Rotational Russian Kettlebell Swings",
            targetMuscle: "Posterior Chain & Core",
            equipment: "Kettlebell",
            sets: 4,
            reps: "40s work",
            restSeconds: 20,
            instructions: ["Hinge deeply at hips", "Snap glutes forward into full extension"],
            formCues: ["Power comes strictly from hip hinge, not arms"],
            thumbnail: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=400",
          },
        ],
      },
      suggestedPrompts: [
        "Add this to tomorrow's schedule in Planner",
        "Give me a 5-minute dynamic warmup for this session",
        "How much water should I drink during this HIIT workout?",
      ],
    };
  }

  // Shoulder impingement / Injury
  if (p.includes("shoulder") || p.includes("impingement") || p.includes("pain") || p.includes("alternative")) {
    return {
      category: "workout",
      text: "Subacromial impingement is frequently exacerbated by overhead movements with poor scapular upward rotation. Here are 3 science-backed modifications:\n\n1. **Replace Barbell Overhead Press with Landmine Press**: The 45-degree pressing angle significantly clears the subacromial space.\n2. **Replace Flat Bench Press with Floor Press**: Eliminates excessive shoulder hyperextension at the bottom of the movement.\n3. **Prescribe Y-T-W Scapular Retractions**: 3 sets of 12 reps with light bands to strengthen the lower trapezius and serratus anterior before any pressing.",
      suggestedPrompts: [
        "Show me rotator cuff rehab exercises",
        "Should I foam roll my lats?",
        "Can I still train chest today?",
      ],
    };
  }

  // Nutrition / Protein
  if (p.includes("protein") || p.includes("calorie") || p.includes("diet") || p.includes("macros") || p.includes("nutrition")) {
    return {
      category: "nutrition",
      text: "Based on your active bodyweight of **69.9 kg** with high-volume athletic conditioning:\n\n- **Target Daily Protein**: **140–154g** (2.0–2.2g per kg bodyweight) distributed across 4 meals of ~35-38g to optimize Muscle Protein Synthesis (MPS).\n- **Daily Caloric Expenditure**: ~2,450 kcal maintenance.\n- **Fat Loss Caloric Deficit**: **2,050 kcal/day** (~400 kcal deficit) to safely lose ~0.4 kg/week of pure adiposity while preserving muscle mass.\n- **Hydration Target**: 3.2 Liters/day with 500mg sodium pre-workout.",
      suggestedPrompts: [
        "Best whole-food protein sources for 150g target",
        "What to eat 45 minutes before lifting?",
        "How much creatine should I take?",
      ],
    };
  }

  // Soreness / Recovery / Hamstrings
  if (p.includes("sore") || p.includes("recovery") || p.includes("hamstring") || p.includes("sleep") || p.includes("doms")) {
    return {
      category: "recovery",
      text: "Delayed Onset Muscle Soreness (DOMS) in the hamstrings responds best to **Active Hyperemia Protocols** rather than complete sedentary immobilization:\n\n1. **20-Min Zone 1 Incline Walk**: Boosts blood flow and accelerates metabolic waste clearance without central nervous system strain.\n2. **Foam Rolling Posterior Chain**: 90 seconds per leg on hamstring belly and glute medius.\n3. **Magnesium Glycinate (300mg)** 45 minutes before sleep to reduce muscle cramping and enhance deep slow-wave REM sleep.\n4. **Cold Contrast Shower**: 1 min cold (15°C) alternating with 2 min warm for 3 cycles.",
      suggestedPrompts: [
        "Should I take a rest day today?",
        "How does cold plunge affect muscle growth?",
        "Best stretches for tight hip flexors",
      ],
    };
  }

  // Default Athletic Advice
  return {
    category: "general",
    text: `Analyzing your athletic trajectory: Your neuromuscular readiness is at **88%**, placing you in the **Optimal Stimulus Zone**. Progressive overload is compounding nicely with your current 7-day microcycle.\n\nKeep focusing on progressive volume increments (+2.5% load or +1 rep per set) and ensure 8+ hours of sleep tonight for full glycogen resynthesis.`,
    suggestedPrompts: [
      "Generate a 25-min HIIT core burner",
      "Calculate daily protein & calorie targets for 69.9kg",
      "Optimal recovery protocol for sore hamstrings",
    ],
  };
}

/**
 * GET /api/coach/:userId
 * Retrieves user's complete coach chat history and readiness score
 */
export async function getCoachHistory(req: Request, res: Response): Promise<void> {
  try {
    const userId = String(req.params.userId);

    if (!isDbConnected()) {
      const coach = getOrCreateMemoryCoach(userId);
      sendResponse(res, 200, {
        success: true,
        message: "Coach history retrieved from fallback store",
        data: coach,
      });
      return;
    }

    let coach = await Coach.findOne({ userId });

    if (!coach) {
      coach = await Coach.create({
        userId,
        messages: [defaultWelcomeMessage],
        readinessScore: 88,
        fatigueLevel: "optimal",
      });
    }

    sendResponse(res, 200, {
      success: true,
      message: "Coach history retrieved successfully",
      data: coach,
    });
  } catch (error) {
    sendResponse(res, 500, {
      success: false,
      message: "Failed to fetch coach history",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * POST /api/coach/:userId/chat
 * Handles sending a message to AI Coach, saving to MongoDB Atlas
 */
export async function postChatMessage(req: Request, res: Response): Promise<void> {
  try {
    const userId = String(req.params.userId);
    const { message } = req.body as { message?: string };

    if (!message || !message.trim()) {
      sendResponse(res, 400, { success: false, message: "message is required" });
      return;
    }

    const trimmed = message.trim();
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const userMsg: ICoachMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: trimmed,
      timestamp: timeFormatted,
    };

    const aiResult = generateAthleticResponse(trimmed);
    const assistantMsg: ICoachMessage = {
      id: `asst-${Date.now() + 1}`,
      sender: "assistant",
      text: aiResult.text,
      timestamp: timeFormatted,
      category: aiResult.category,
      generatedWorkout: aiResult.generatedWorkout,
      suggestedPrompts: aiResult.suggestedPrompts,
    };

    if (!isDbConnected()) {
      const coach = getOrCreateMemoryCoach(userId);
      coach.messages.push(userMsg, assistantMsg);
      coach.updatedAt = new Date().toISOString();
      sendResponse(res, 200, {
        success: true,
        message: "Message processed in fallback store",
        data: {
          userMessage: userMsg,
          assistantMessage: assistantMsg,
          messages: coach.messages,
        },
      });
      return;
    }

    let coach = await Coach.findOne({ userId });
    if (!coach) {
      coach = await Coach.create({
        userId,
        messages: [defaultWelcomeMessage],
        readinessScore: 88,
        fatigueLevel: "optimal",
      });
    }

    coach.messages.push(userMsg, assistantMsg);
    coach.markModified("messages");
    await coach.save();

    sendResponse(res, 200, {
      success: true,
      message: "Message processed successfully",
      data: {
        userMessage: userMsg,
        assistantMessage: assistantMsg,
        messages: coach.messages,
      },
    });
  } catch (error) {
    sendResponse(res, 500, {
      success: false,
      message: "Failed to process coach chat message",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

/**
 * DELETE /api/coach/:userId/history
 * Clears chat history for a user
 */
export async function clearChatHistory(req: Request, res: Response): Promise<void> {
  try {
    const userId = String(req.params.userId);

    if (!isDbConnected()) {
      const coach = getOrCreateMemoryCoach(userId);
      coach.messages = [{ ...defaultWelcomeMessage }];
      coach.updatedAt = new Date().toISOString();
      sendResponse(res, 200, {
        success: true,
        message: "Coach history reset in fallback store",
        data: coach,
      });
      return;
    }

    const coach = await Coach.findOneAndUpdate(
      { userId },
      { $set: { messages: [defaultWelcomeMessage] } },
      { new: true, upsert: true }
    );

    sendResponse(res, 200, {
      success: true,
      message: "Coach history reset successfully",
      data: coach,
    });
  } catch (error) {
    sendResponse(res, 500, {
      success: false,
      message: "Failed to reset coach history",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}
