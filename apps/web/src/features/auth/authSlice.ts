import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { authService, LoginPayload, SignupPayload } from "@/services/api/authService";
import { User } from "@/types";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  userId: string | null;
  email: string | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const getStoredToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("fitsync-token");
  }
  return null;
};

const getStoredUser = (): User | null => {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("fitsync-user");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
  }
  return null;
};

const initialToken = getStoredToken();
const initialUser = getStoredUser();

const initialState: AuthState = {
  isAuthenticated: Boolean(initialToken && initialUser),
  user: initialUser,
  userId: initialUser?.id || null,
  email: initialUser?.email || null,
  token: initialToken,
  loading: false,
  error: null,
};

export const loginAsync = createAsyncThunk(
  "auth/loginAsync",
  async (payload: LoginPayload, { rejectWithValue }) => {
    try {
      const res = await authService.login(payload);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to log in.");
    }
  }
);

export const signupAsync = createAsyncThunk(
  "auth/signupAsync",
  async (payload: SignupPayload, { rejectWithValue }) => {
    try {
      const res = await authService.signup(payload);
      return res;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to create account.");
    }
  }
);

export const fetchCurrentUserAsync = createAsyncThunk(
  "auth/fetchCurrentUserAsync",
  async (_, { rejectWithValue }) => {
    try {
      const user = await authService.getMe();
      return user;
    } catch (err: any) {
      return rejectWithValue(err.message || "Failed to fetch user.");
    }
  }
);

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (
      state,
      action: PayloadAction<{ user: User; token: string } | null>
    ) => {
      if (action.payload) {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.userId = action.payload.user.id;
        state.email = action.payload.user.email;
        state.token = action.payload.token;
        if (typeof window !== "undefined") {
          localStorage.setItem("fitsync-token", action.payload.token);
          localStorage.setItem("fitsync-user", JSON.stringify(action.payload.user));
          localStorage.setItem("fitsync-user-profile", JSON.stringify(action.payload.user));
        }
      } else {
        state.isAuthenticated = false;
        state.user = null;
        state.userId = null;
        state.email = null;
        state.token = null;
        if (typeof window !== "undefined") {
          localStorage.removeItem("fitsync-token");
          localStorage.removeItem("fitsync-user");
        }
      }
      state.loading = false;
      state.error = null;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.userId = null;
      state.email = null;
      state.token = null;
      state.error = null;
      state.loading = false;
      if (typeof window !== "undefined") {
        localStorage.removeItem("fitsync-token");
        localStorage.removeItem("fitsync-user");
      }
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.userId = action.payload.user.id;
        state.email = action.payload.user.email;
        state.token = action.payload.token;
        state.error = null;
        if (typeof window !== "undefined") {
          localStorage.setItem("fitsync-token", action.payload.token);
          localStorage.setItem("fitsync-user", JSON.stringify(action.payload.user));
          localStorage.setItem("fitsync-user-profile", JSON.stringify(action.payload.user));
        }
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Invalid email or password.";
      });

    // Signup
    builder
      .addCase(signupAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signupAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.userId = action.payload.user.id;
        state.email = action.payload.user.email;
        state.token = action.payload.token;
        state.error = null;
        if (typeof window !== "undefined") {
          localStorage.setItem("fitsync-token", action.payload.token);
          localStorage.setItem("fitsync-user", JSON.stringify(action.payload.user));
          localStorage.setItem("fitsync-user-profile", JSON.stringify(action.payload.user));
        }
      })
      .addCase(signupAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Account registration failed.";
      });

    // Fetch Current User
    builder
      .addCase(fetchCurrentUserAsync.fulfilled, (state, action) => {
        state.user = action.payload;
        state.userId = action.payload.id;
        state.email = action.payload.email;
        if (typeof window !== "undefined") {
          localStorage.setItem("fitsync-user", JSON.stringify(action.payload));
        }
      });
  },
});

export const { setAuthUser, clearAuthError, logout } = authSlice.actions;
export default authSlice.reducer;
