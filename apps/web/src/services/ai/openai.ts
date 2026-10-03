/**
 * AI Service Layer for FitSync
 * Dual-engine: Direct OpenAI API + Local Athletic Intelligence Engine
 */

import { Workout } from "@/types";

export interface AIChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AIResponse {
  text: string;
  category: "general" | "workout" | "recovery" | "nutrition";
  generatedWorkout?: Workout;
  suggestedPrompts?: string[];
}

export class AIService {
  private apiKey: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || "";
  }

  public async sendMessage(
    message: string,
    history: AIChatMessage[] = []
  ): Promise<AIResponse> {
    const trimmed = message.trim();

    // If API key is present, attempt live OpenAI API request
    if (this.apiKey) {
      try {
        return await this.fetchOpenAIResponse(trimmed, history);
      } catch (err) {
        console.warn("OpenAI API call failed, falling back to local athletic engine:", err);
        return this.getAthleticEngineResponse(trimmed);
      }
    }

    // Default: Athletic Domain Intelligence Engine with realistic latency
    await new Promise((res) => setTimeout(res, 600));
    return this.getAthleticEngineResponse(trimmed);
  }

  private async fetchOpenAIResponse(
    message: string,
    history: AIChatMessage[]
  ): Promise<AIResponse> {
    const systemPrompt = `You are FitSync AI Coach, an elite sports scientist and strength & conditioning director. The athlete is Alex Hunter (69.9 kg, target 68.0 kg, 7-day streak, active training volume 23,500 kg/week). Provide concise, evidence-based, high-energy coaching advice. If generating a workout, format exercises with sets, reps, and rest periods clearly.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...history.map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: message },
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages,
        temperature: 0.7,
        max_tokens: 600,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API responded with status ${response.status}`);
    }

    const data = await response.json();
    const replyText = data.choices[0]?.message?.content || "";

    return {
      text: replyText,
      category: this.categorizeMessage(message),
      suggestedPrompts: this.getFollowupPrompts(message),
    };
  }

  /**
   * Built-in Athletic Intelligence Engine
   * Provides domain-specific sports science responses with structured workouts
   */
  private getAthleticEngineResponse(prompt: string): AIResponse {
    const p = prompt.toLowerCase();

    // 1. WORKOUT GENERATION INTENT
    if (
      p.includes("workout") ||
      p.includes("routine") ||
      p.includes("generate") ||
      p.includes("hiit") ||
      p.includes("chest") ||
      p.includes("leg") ||
      p.includes("core burner")
    ) {
      const generatedWorkout: Workout = {
        id: `ai-gen-${Date.now()}`,
        title: p.includes("core")
          ? "AI Core Shred & Rotational Power"
          : p.includes("chest")
          ? "AI Upper Body Mechanical Hypertrophy"
          : "AI High-Density Metabolic HIIT",
        category: p.includes("chest") ? "strength" : "hiit",
        targetGoal: p.includes("chest") ? "hypertrophy" : "fat_loss",
        duration: 25,
        calories: 320,
        difficulty: "intermediate",
        equipment: "dumbbell",
        bodyPart: p.includes("chest") ? "chest" : "full_body",
        thumbnail:
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800",
        description:
          "Custom AI-generated microcycle routine designed around your current 69.9 kg weight and 88% readiness score.",
        exercises: [
          {
            id: "ai-ex-1",
            name: "Dumbbell Devil Presses",
            targetMuscle: "Full Body & Delts",
            equipment: "Dumbbells",
            sets: 4,
            reps: "10 reps",
            restSeconds: 45,
            instructions: [
              "Perform a chest-to-floor burpee holding hex dumbbells.",
              "Jump feet up and snatch weights overhead in a single fluid hip hinge.",
            ],
            formCues: ["Keep core rigid at lockout", "Use hip drive, not arm pull"],
            thumbnail:
              "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600",
          },
          {
            id: "ai-ex-2",
            name: "Renegade Row to Plank Knee Tuck",
            targetMuscle: "Core & Lats",
            equipment: "Dumbbells",
            sets: 3,
            reps: "12 reps / side",
            restSeconds: 45,
            instructions: [
              "Hold high plank on hex dumbbells, row one dumbbell to hip pocket.",
              "Drive knee diagonally across chest before switching sides.",
            ],
            formCues: ["Anti-rotation through pelvis", "Hips stay parallel to floor"],
            thumbnail:
              "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=600",
          },
          {
            id: "ai-ex-3",
            name: "Goblet Cyclist Squats",
            targetMuscle: "Quadriceps & Glutes",
            equipment: "Dumbbells",
            sets: 4,
            reps: "15 reps",
            restSeconds: 60,
            instructions: [
              "Elevate heels 1-2 inches on a wedge or plate.",
              "Lower under 3-second tension focusing on deep knee flexion.",
            ],
            formCues: ["Stay upright", "Maximize VMO quad recruitment"],
            thumbnail:
              "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=600",
          },
        ],
      };

      return {
        text: `Here is your customized **${generatedWorkout.title}** session! I calibrated this routine specifically for your current **69.9 kg bodyweight** and **88% Prime Readiness Score**. It emphasizes high motor unit recruitment while keeping joint impact manageable.`,
        category: "workout",
        generatedWorkout,
        suggestedPrompts: [
          "Add this routine to my Weekly Planner",
          "What is the ideal warmup for this workout?",
          "How much water should I drink post-session?",
        ],
      };
    }

    // 2. RECOVERY & FATIGUE / INJURY INTENT
    if (
      p.includes("recover") ||
      p.includes("fatigue") ||
      p.includes("sore") ||
      p.includes("shoulder") ||
      p.includes("hamstring") ||
      p.includes("pain") ||
      p.includes("sleep")
    ) {
      return {
        text: `Based on your **7-day streak** and cumulative **23,500 kg volume**, here is my athletic recovery prescription:
\n1. **Joint Decompression**: If you're experiencing shoulder or lower-back tension, swap standard barbell bench for **30-degree incline neutral-grip dumbbell presses** or floor presses to eliminate anterior capsule shearing.
\n2. **Active Flush Protocol**: Dedicate 15–20 minutes to Zone 2 nasal-only walking or light spinning (heart rate strictly 115–125 bpm) to flush metabolic byproducts.
\n3. **Hydration & Electrolytes**: Drink an additional 500ml of water with 300mg sodium and 100mg magnesium before bed to support muscle spindle relaxation.`,
        category: "recovery",
        suggestedPrompts: [
          "View Mobility routines in Video Library",
          "Should I take an active recovery rest day tomorrow?",
          "How to optimize deep sleep for muscle repair?",
        ],
      };
    }

    // 3. NUTRITION & PROTEIN INTENT
    if (
      p.includes("protein") ||
      p.includes("nutrition") ||
      p.includes("calorie") ||
      p.includes("diet") ||
      p.includes("carb") ||
      p.includes("macro")
    ) {
      return {
        text: `For your current biometric profile (**69.9 kg bodyweight**, aiming for **68.0 kg lean target**), here is your evidence-based macro strategy:
\n- **Daily Protein Target**: **145g – 155g** (~2.1g per kg bodyweight) to preserve lean mass during slight caloric deficit.
- **Caloric Intake**: **2,050 kcal/day** (~300 kcal deficit under your 2,350 kcal TDEE).
- **Nutrient Timing**:
  - *Pre-Workout (60m prior)*: 35g complex carbs (oats/banana) + 20g whey.
  - *Post-Workout (within 90m)*: 35g protein + 40g carbohydrates to maximize glycogen re-synthesis.
- **Creatine**: 5g daily monohydrate for intracellular hydration and power endurance.`,
        category: "nutrition",
        suggestedPrompts: [
          "Generate a high-protein daily meal schedule",
          "What are the best fast-digesting pre-workout snacks?",
          "How to prevent hunger during evening caloric deficits?",
        ],
      };
    }

    // 4. PROGRESSION & OVERLOAD INTENT
    if (
      p.includes("overload") ||
      p.includes("progression") ||
      p.includes("heavier") ||
      p.includes("velocity") ||
      p.includes("streak")
    ) {
      return {
        text: `Your progression trajectory is exceptional! You have achieved **-3.1 kg total weight loss** from 73.0 kg while increasing total lifted tonnage to **23.5k kg** across your current **7-day streak**.
\n**Coach's Overload Directive for Next Week:**
- Apply a **2.5 kg micro-load** to your primary compounds (Incline Bench & Rows).
- Maintain current reps (8–10) with strict 3-second eccentric tempo rather than chasing sudden weight jumps.
- Keep total weekly training volume between 22,000–25,000 kg to prevent central nervous system fatigue.`,
        category: "general",
        suggestedPrompts: [
          "Generate next week's progressive overload split",
          "Evaluate my chest & back volume balance",
          "Check my active readiness score",
        ],
      };
    }

    // Default helpful coaching fallback
    return {
      text: `Coach Alex here! I have reviewed your biometric telemetry (**69.9 kg**, **88% Readiness**, **7-Day Streak**).
\nI can help you with:
- **Custom Workout Generation**: Formulate high-intensity HIIT or hypertrophy routines calibrated to your equipment.
- **Biomechanical Form Cues**: Modify movements for joint longevity and optimal muscle engagement.
- **Nutritional & Macro Targeting**: Tailor protein and calorie benchmarks for your 68.0 kg target.
- **Recovery Diagnostics**: Manage CNS fatigue and active mobility protocols.
\nWhat specific objective should we focus on today?`,
      category: "general",
      suggestedPrompts: [
        "Generate a 25-min HIIT core burner",
        "Alternative exercises for shoulder impingement",
        "Calculate daily protein & calorie targets for 69.9kg",
        "Optimal recovery protocol for sore hamstrings",
      ],
    };
  }

  private categorizeMessage(
    prompt: string
  ): "general" | "workout" | "recovery" | "nutrition" {
    const p = prompt.toLowerCase();
    if (p.includes("workout") || p.includes("routine") || p.includes("exercise"))
      return "workout";
    if (p.includes("recover") || p.includes("sore") || p.includes("sleep"))
      return "recovery";
    if (p.includes("protein") || p.includes("nutrition") || p.includes("calorie"))
      return "nutrition";
    return "general";
  }

  private getFollowupPrompts(prompt: string): string[] {
    const p = prompt.toLowerCase();
    if (p.includes("workout")) {
      return [
        "Add this routine to my Weekly Planner",
        "Adjust workout duration to 20 minutes",
        "What equipment can replace dumbbells?",
      ];
    }
    return [
      "Generate a customized training routine",
      "How is my weekly volume progression?",
      "Optimize my post-workout nutrition",
    ];
  }
}

export const aiService = new AIService();
