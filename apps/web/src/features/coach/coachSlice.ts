import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { CoachChatMessage, Workout } from "@/types";
import { coachService } from "@/services/api/coachService";

interface CoachState {
  messages: CoachChatMessage[];
  isTyping: boolean;
  readinessScore: number;
  fatigueLevel: "fresh" | "optimal" | "fatigued" | "overtrained";
  activeFilter: "all" | "workout" | "recovery" | "nutrition";
  loading: boolean;
  isLiveSynced: boolean;
  error: string | null;
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
  loading: false,
  isLiveSynced: false,
  error: null,
};

// Async Thunks
export const fetchCoachHistory = createAsyncThunk(
  "coach/fetchCoachHistory",
  async (userId: string = "demo-user-1") => {
    return await coachService.getCoachHistory(userId);
  }
);

export const sendCoachMessageAsync = createAsyncThunk(
  "coach/sendCoachMessageAsync",
  async ({
    userId = "demo-user-1",
    message,
  }: {
    userId?: string;
    message: string;
  }) => {
    return await coachService.sendMessage(userId, message);
  }
);

export const clearCoachHistoryAsync = createAsyncThunk(
  "coach/clearCoachHistoryAsync",
  async (userId: string = "demo-user-1") => {
    return await coachService.clearHistory(userId);
  }
);

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
  extraReducers: (builder) => {
    // fetchCoachHistory
    builder.addCase(fetchCoachHistory.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchCoachHistory.fulfilled, (state, action) => {
      state.loading = false;
      state.isLiveSynced = true;
      if (action.payload) {
        if (action.payload.messages && action.payload.messages.length > 0) {
          state.messages = action.payload.messages;
        }
        if (action.payload.readinessScore) {
          state.readinessScore = action.payload.readinessScore;
        }
        if (action.payload.fatigueLevel) {
          state.fatigueLevel = action.payload.fatigueLevel;
        }
      }
    });
    builder.addCase(fetchCoachHistory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to load coach history";
    });

    // sendCoachMessageAsync
    builder.addCase(sendCoachMessageAsync.pending, (state) => {
      state.isTyping = true;
    });
    builder.addCase(sendCoachMessageAsync.fulfilled, (state, action) => {
      state.isTyping = false;
      state.isLiveSynced = true;
      if (action.payload?.messages) {
        state.messages = action.payload.messages;
      }
    });
    builder.addCase(sendCoachMessageAsync.rejected, (state, action) => {
      state.isTyping = false;
      state.error = action.error.message || "Failed to send message";
    });

    // clearCoachHistoryAsync
    builder.addCase(clearCoachHistoryAsync.fulfilled, (state, action) => {
      state.isLiveSynced = true;
      if (action.payload?.messages) {
        state.messages = action.payload.messages;
      } else {
        state.messages = [initialMessages[0]];
      }
    });
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
