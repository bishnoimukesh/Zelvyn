import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: "workout" | "streak" | "ai" | "system";
}

export type AppTheme = "dark" | "light";

interface UIState {
  theme: AppTheme;
  mobileMenuOpen: boolean;
  mobileDrawerOpen: boolean;
  notificationsOpen: boolean;
  notifications: NotificationItem[];
  activeModal: string | null;
}

const getInitialTheme = (): AppTheme => {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("fitsync-theme");
    if (saved === "light" || saved === "dark") {
      return saved;
    }
  }
  return "dark";
};

const initialNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Workout Reminder",
    message: "Hypertrophy Chest & Back scheduled today at 6:00 PM.",
    timestamp: "10m ago",
    read: false,
    type: "workout",
  },
  {
    id: "notif-2",
    title: "Streak Preserved!",
    message: "You've hit a 5-day active workout streak. Keep the momentum!",
    timestamp: "2h ago",
    read: false,
    type: "streak",
  },
  {
    id: "notif-3",
    title: "AI Coach Insight",
    message: "Hydration target achieved. Your recovery readiness is 94%.",
    timestamp: "5h ago",
    read: true,
    type: "ai",
  },
];

const initialState: UIState = {
  theme: getInitialTheme(),
  mobileMenuOpen: false,
  mobileDrawerOpen: false,
  notificationsOpen: false,
  notifications: initialNotifications,
  activeModal: null,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<AppTheme>) => {
      state.theme = action.payload;
      if (typeof window !== "undefined") {
        localStorage.setItem("fitsync-theme", action.payload);
        if (action.payload === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    },
    toggleTheme: (state) => {
      const nextTheme = state.theme === "dark" ? "light" : "dark";
      state.theme = nextTheme;
      if (typeof window !== "undefined") {
        localStorage.setItem("fitsync-theme", nextTheme);
        if (nextTheme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
    },
    toggleMobileDrawer: (state) => {
      state.mobileDrawerOpen = !state.mobileDrawerOpen;
    },
    setMobileDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.mobileDrawerOpen = action.payload;
    },
    toggleNotifications: (state) => {
      state.notificationsOpen = !state.notificationsOpen;
    },
    setNotificationsOpen: (state, action: PayloadAction<boolean>) => {
      state.notificationsOpen = action.payload;
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notif = state.notifications.find((n) => n.id === action.payload);
      if (notif) {
        notif.read = true;
      }
    },
    markAllNotificationsAsRead: (state) => {
      state.notifications.forEach((n) => {
        n.read = true;
      });
    },
    clearNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
    openModal: (state, action: PayloadAction<string>) => {
      state.activeModal = action.payload;
    },
    closeModal: (state) => {
      state.activeModal = null;
    },
  },
});

export const {
  setTheme,
  toggleTheme,
  toggleMobileDrawer,
  setMobileDrawerOpen,
  toggleNotifications,
  setNotificationsOpen,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearNotification,
  openModal,
  closeModal,
} = uiSlice.actions;

export default uiSlice.reducer;
