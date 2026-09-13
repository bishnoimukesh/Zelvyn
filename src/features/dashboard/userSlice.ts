import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types";

interface UserState {
  profile: User;
  loading: boolean;
  isOnboardingModalOpen: boolean;
  isEditProfileModalOpen: boolean;
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

const initialState: UserState = {
  profile: getInitialProfile(),
  loading: false,
  isOnboardingModalOpen: false,
  isEditProfileModalOpen: false,
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
