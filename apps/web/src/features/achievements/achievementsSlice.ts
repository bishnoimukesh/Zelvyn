import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { achievementsService, GamificationData, AchievementItem } from "@/services/api/achievementsService";

interface AchievementsState {
  level: number;
  title: string;
  currentXp: number;
  nextLevelXp: number;
  achievements: AchievementItem[];
  loading: boolean;
  error: string | null;
  source: string;
  isUnlocking: boolean;
}

const initialState: AchievementsState = {
  level: 1,
  title: "Fitness Novice",
  currentXp: 0,
  nextLevelXp: 200,
  achievements: [],
  loading: false,
  error: null,
  source: "mongodb",
  isUnlocking: false,
};

export const fetchGamification = createAsyncThunk(
  "achievements/fetchGamification",
  async (userId: string = "demo-user-1", { rejectWithValue }) => {
    try {
      return await achievementsService.getGamification(userId);
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to load achievements");
    }
  }
);

export const unlockAchievementAsync = createAsyncThunk(
  "achievements/unlockAchievement",
  async (
    payload: { userId: string; achievementId: string },
    { rejectWithValue }
  ) => {
    try {
      return await achievementsService.unlockAchievement(payload.userId, payload.achievementId);
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to unlock achievement");
    }
  }
);

export const addXpAsync = createAsyncThunk(
  "achievements/addXp",
  async (
    payload: { userId: string; xp: number },
    { rejectWithValue }
  ) => {
    try {
      return await achievementsService.addXp(payload.userId, payload.xp);
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to add XP");
    }
  }
);

const achievementsSlice = createSlice({
  name: "achievements",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchGamification
      .addCase(fetchGamification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGamification.fulfilled, (state, action) => {
        state.loading = false;
        const data = (action.payload as any)?.data ?? action.payload;
        if (data) {
          state.level = data.level || 1;
          state.title = data.title || "Fitness Novice";
          state.currentXp = data.currentXp || 0;
          state.nextLevelXp = data.nextLevelXp || 200;
          state.achievements = Array.isArray(data.achievements) ? data.achievements : [];
        }
        if ((action.payload as any)?.source) {
          state.source = (action.payload as any).source;
        }
      })
      .addCase(fetchGamification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // unlockAchievement
      .addCase(unlockAchievementAsync.pending, (state) => {
        state.isUnlocking = true;
      })
      .addCase(unlockAchievementAsync.fulfilled, (state, action) => {
        state.isUnlocking = false;
        const data = action.payload;
        state.level = data.level;
        state.title = data.title;
        state.currentXp = data.currentXp;
        state.nextLevelXp = data.nextLevelXp;
        state.achievements = data.achievements;
      })
      .addCase(unlockAchievementAsync.rejected, (state, action) => {
        state.isUnlocking = false;
        state.error = action.payload as string;
      })

      // addXp
      .addCase(addXpAsync.fulfilled, (state, action) => {
        const data = action.payload;
        state.level = data.level;
        state.title = data.title;
        state.currentXp = data.currentXp;
        state.nextLevelXp = data.nextLevelXp;
        state.achievements = data.achievements;
      });
  },
});

export const achievementsReducer = achievementsSlice.reducer;
