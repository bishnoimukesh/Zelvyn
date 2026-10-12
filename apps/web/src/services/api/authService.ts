import { apiClient } from "./apiClient";
import { User } from "@/types";

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  fitnessLevel?: "beginner" | "intermediate" | "advanced";
  goal?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponseData {
  user: User;
  token: string;
}

export const authService = {
  signup: async (payload: SignupPayload): Promise<AuthResponseData> => {
    return apiClient.post<AuthResponseData>("/auth/signup", payload);
  },

  login: async (payload: LoginPayload): Promise<AuthResponseData> => {
    return apiClient.post<AuthResponseData>("/auth/login", payload);
  },

  getMe: async (): Promise<User> => {
    return apiClient.get<User>("/auth/me");
  },

  syncUser: async (payload: {
    email: string;
    name: string;
    avatarUrl?: string;
    fitnessLevel?: string;
    goal?: string;
  }): Promise<AuthResponseData> => {
    return apiClient.post<AuthResponseData>("/auth/sync", payload);
  },
};
