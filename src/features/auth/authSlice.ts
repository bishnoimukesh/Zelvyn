import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isAuthenticated: boolean;
  userId: string | null;
  email: string | null;
  loading: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  userId: null,
  email: null,
  loading: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (
      state,
      action: PayloadAction<{ userId: string; email: string } | null>
    ) => {
      if (action.payload) {
        state.isAuthenticated = true;
        state.userId = action.payload.userId;
        state.email = action.payload.email;
      } else {
        state.isAuthenticated = false;
        state.userId = null;
        state.email = null;
      }
      state.loading = false;
    },
    setAuthLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.userId = null;
      state.email = null;
    },
  },
});

export const { setAuthUser, setAuthLoading, logout } = authSlice.actions;
export default authSlice.reducer;
