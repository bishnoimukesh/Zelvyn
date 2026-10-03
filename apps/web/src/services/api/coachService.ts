import { apiClient, ApiResponse } from "./apiClient";
import { CoachChatMessage } from "@/types";

export interface CoachHistoryResponse {
  userId: string;
  messages: CoachChatMessage[];
  readinessScore: number;
  fatigueLevel: "fresh" | "optimal" | "fatigued" | "overtrained";
}

export interface ChatMessageResponse {
  userMessage: CoachChatMessage;
  assistantMessage: CoachChatMessage;
  messages: CoachChatMessage[];
}

export const coachService = {
  /**
   * Fetch complete coach conversation history
   */
  async getCoachHistory(userId: string): Promise<CoachHistoryResponse> {
    const res = await apiClient.get<ApiResponse<CoachHistoryResponse>>(`/coach/${userId}`);
    return res.data;
  },

  /**
   * Send a chat message to AI coach and persist response
   */
  async sendMessage(userId: string, message: string): Promise<ChatMessageResponse> {
    const res = await apiClient.post<ApiResponse<ChatMessageResponse>>(
      `/coach/${userId}/chat`,
      { message }
    );
    return res.data;
  },

  /**
   * Reset / clear chat history
   */
  async clearHistory(userId: string): Promise<CoachHistoryResponse> {
    const res = await apiClient.delete<ApiResponse<CoachHistoryResponse>>(
      `/coach/${userId}/history`
    );
    return res.data;
  },
};
