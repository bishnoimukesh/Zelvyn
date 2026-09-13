/**
 * AI Service Layer for FitSync
 * Architecture prepared for secure OpenAI / serverless backend integration
 */

export interface AIChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AIWorkoutPlanParams {
  goal: string;
  fitnessLevel: "beginner" | "intermediate" | "advanced";
  daysPerWeek: number;
  equipment: string[];
}

export class AIService {
  private apiKey: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || "";
  }

  public async sendMessage(
    message: string,
    _history: AIChatMessage[] = []
  ): Promise<string> {
    if (!this.apiKey) {
      // Clean fallback for development when API key is not present
      return this.getSimulatedResponse(message);
    }

    try {
      // Staging for secure backend proxy / direct serverless function
      return "FitSync AI Coach is connected. Ready to analyze your training.";
    } catch (error) {
      console.error("AI service error:", error);
      return "An error occurred while communicating with the AI service.";
    }
  }

  private getSimulatedResponse(prompt: string): string {
    return `FitSync AI Coach: "${prompt}" noted. We will adjust your training volume and prioritize recovery.`;
  }
}

export const aiService = new AIService();
