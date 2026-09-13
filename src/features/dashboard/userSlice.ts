import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@/types";

interface UserState {
  profile: User | null;
  loading: boolean;
}

const initialState: UserState = {
  profile: {
    id: "demo-user-1",
    name: "Alex Morgan",
    email: "alex@fitsync.ai",
    fitnessLevel: "intermediate",
    height: 175,
    weight: 70,
    targetWeight: 67,
  },
  loading: false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserProfile: (state, action: PayloadAction<User | null>) => {
      state.profile = action.payload;
      state.loading = false;
    },
    updateUserProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
  },
});

export const { setUserProfile, updateUserProfile } = userSlice.actions;
export default userSlice.reducer;
