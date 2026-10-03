import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CoachChatMessage, Workout } from "@/types";

interface CoachState {
  messages: CoachChatMessage[];
  isTyping: boolean;
  readinessScore: number;
  fatigueLevel: "fresh" | "optimal" | "fatigued" | "overtrained";
  activeFilter: "all" | "workout" | "recovery" | "nutrition";
}

const initialMessages: CoachChatMessage[] = [
  {
    id: "m-welcome",
    sender: "assistant",
    text: "Hello Alex! I am your FitSync AI Athletic Coach. I've synced your latest biometrics: **69.9 kg bodyweight**, **7-Day Active Streak**, and **88% Prime Readiness**. I can engineer customized workout routines, diagnose training fatigue, prescribe macro splits, or analyze your progressive overload. What are we targeting today?",
    timestamp: "Just now",
    category: "general",
    suggestedPrompts: [
      "Generate a 25-min HIIT core burner",
      "Alternative exercises for shoulder impingement",
      "Calculate daily protein & calorie targets for 69.9kg",
      "Optimal recovery protocol for sore hamstrings",
    ],
  },
];

const initialState: CoachState = {
  messages: initialMessages,
  isTyping: false,
  readinessScore: 88,
  fatigueLevel: "optimal",
  activeFilter: "all",
};

export const coachSlice = createSlice({
  name: "coach",
  initialState,
  reducers: {
    addUserMessage: (state, action: PayloadAction<string>) => {
      const newMsg: CoachChatMessage = {
        id: `user-${Date.now()}`,
        sender: "user",
        text: action.payload,
        timestamp: "Just now",
      };
      state.messages.push(newMsg);
      state.isTyping = true;
    },
    addAssistantMessage: (
      state,
      action: PayloadAction<{
        text: string;
        category?: "general" | "workout" | "recovery" | "nutrition";
        generatedWorkout?: Workout;
        suggestedPrompts?: string[];
      }>
    ) => {
      const { text, category, generatedWorkout, suggestedPrompts } =
        action.payload;
      const newMsg: CoachChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "assistant",
        text,
        timestamp: "Just now",
        category,
        generatedWorkout,
        suggestedPrompts,
      };
      state.messages.push(newMsg);
      state.isTyping = false;
    },
    setTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },
    setActiveFilter: (
      state,
      action: PayloadAction<"all" | "workout" | "recovery" | "nutrition">
    ) => {
      state.activeFilter = action.payload;
    },
    clearChatHistory: (state) => {
      state.messages = [initialMessages[0]];
      state.isTyping = false;
    },
  },
});

export const {
  addUserMessage,
  addAssistantMessage,
  setTyping,
  setActiveFilter,
  clearChatHistory,
} = coachSlice.actions;

export default coachSlice.reducer;
