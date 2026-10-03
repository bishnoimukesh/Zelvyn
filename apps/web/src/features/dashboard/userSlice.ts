import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { userService } from "@/services/api/userService";
import { User } from "@/types";

interface UserState {
  profile: User;
  loading: boolean;
  isLiveSynced: boolean;
  isOnboardingModalOpen: boolean;
  isEditProfileModalOpen: boolean;
  error: string | null;
}

const defaultUser: User = {
  id: "demo-user-1",
  name: "Alex Hunter",
  email: "alex@fitsync.ai",
  fitnessLevel: "intermediate",
  height: 175,
  weight: 70,
  targetWeight: 67,
  age: 26,
  gender: "male",
  activityLevel: "moderate",
  goal: "Hypertrophy & Muscle Gain",
  isOnboarded: true,
};

const getInitialProfile = (): User => {
  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("fitsync-user-profile");
      if (saved) {
        return { ...defaultUser, ...JSON.parse(saved) };
      }
    } catch {
      // ignore
    }
  }
  return defaultUser;
};

export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (userId: string) => {
    return await userService.getUserProfile(userId);
  }
);

export const updateUserProfileAsync = createAsyncThunk(
  "user/updateUserProfileAsync",
  async ({ userId, updates }: { userId: string; updates: Partial<User> }) => {
    return await userService.updateUserProfile(userId, updates);
  }
);

export const completeOnboardingAsync = createAsyncThunk(
  "user/completeOnboardingAsync",
  async ({ userId, data }: { userId: string; data: Partial<User> }) => {
    return await userService.completeOnboarding(userId, data);
  }
);

const initialState: UserState = {
  profile: getInitialProfile(),
  loading: false,
  isLiveSynced: false,
  isOnboardingModalOpen: false,
  isEditProfileModalOpen: false,
  error: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserProfile: (state, action: PayloadAction<User>) => {
      state.profile = action.payload;
      state.loading = false;
      if (typeof window !== "undefined") {
        localStorage.setItem("fitsync-user-profile", JSON.stringify(action.payload));
      }
    },
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      state.profile = { ...state.profile, ...action.payload };
      if (typeof window !== "undefined") {
        localStorage.setItem("fitsync-user-profile", JSON.stringify(state.profile));
      }
    },
    completeOnboarding: (state, action: PayloadAction<Partial<User>>) => {
      state.profile = { ...state.profile, ...action.payload, isOnboarded: true };
      state.isOnboardingModalOpen = false;
      if (typeof window !== "undefined") {
        localStorage.setItem("fitsync-user-profile", JSON.stringify(state.profile));
      }
    },
    openOnboardingModal: (state) => {
      state.isOnboardingModalOpen = true;
    },
    closeOnboardingModal: (state) => {
      state.isOnboardingModalOpen = false;
    },
    openEditProfileModal: (state) => {
      state.isEditProfileModalOpen = true;
    },
    closeEditProfileModal: (state) => {
      state.isEditProfileModalOpen = false;
    },
  },
  extraReducers: (builder) => {
    // fetchUserProfile
    builder.addCase(fetchUserProfile.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload) {
        state.profile = action.payload;
        state.isLiveSynced = true;
        if (typeof window !== "undefined") {
          localStorage.setItem("fitsync-user-profile", JSON.stringify(action.payload));
        }
      }
    });
    builder.addCase(fetchUserProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Failed to load user profile";
    });

    // updateUserProfileAsync
    builder.addCase(updateUserProfileAsync.fulfilled, (state, action) => {
      if (action.payload) {
        state.profile = action.payload;
        state.isLiveSynced = true;
        state.isEditProfileModalOpen = false;
        if (typeof window !== "undefined") {
          localStorage.setItem("fitsync-user-profile", JSON.stringify(action.payload));
        }
      }
    });

    // completeOnboardingAsync
    builder.addCase(completeOnboardingAsync.fulfilled, (state, action) => {
      if (action.payload) {
        state.profile = action.payload;
        state.isLiveSynced = true;
        state.isOnboardingModalOpen = false;
        if (typeof window !== "undefined") {
          localStorage.setItem("fitsync-user-profile", JSON.stringify(action.payload));
        }
      }
    });
  },
});

export const {
  setUserProfile,
  updateUserProfile,
  completeOnboarding,
  openOnboardingModal,
  closeOnboardingModal,
  openEditProfileModal,
  closeEditProfileModal,
} = userSlice.actions;

export default userSlice.reducer;
