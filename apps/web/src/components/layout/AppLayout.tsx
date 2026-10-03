import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { fetchUserProfile } from "@/features/dashboard/userSlice";
import { fetchGamification } from "@/features/achievements/achievementsSlice";
import { TopHeader } from "./TopHeader";
import { BottomNav } from "./BottomNav";
import { DesktopSidebar } from "./DesktopSidebar";
import { MobileDrawer } from "./MobileDrawer";

export const AppLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.ui.theme);
  const authUserId = useAppSelector((state) => state.auth.userId);
  const userId = authUserId || "demo-user-1";

  // Globally sync user profile and level/gamification from MongoDB Atlas
  useEffect(() => {
    dispatch(fetchUserProfile(userId));
    dispatch(fetchGamification(userId));
  }, [dispatch, userId]);

  // Sync theme class on <html> element
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-background text-foreground flex font-sans selection:bg-primary selection:text-primary-foreground transition-colors duration-200">
      {/* Desktop Sidebar (visible on md:) */}
      <DesktopSidebar />

      {/* Main Viewport Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <TopHeader />

        {/* Scrollable Content Container */}
        <main className="flex-1">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation (visible on < md) */}
        <BottomNav />

        {/* Mobile Slide-Over Drawer */}
        <MobileDrawer />
      </div>
    </div>
  );
};

export default AppLayout;
