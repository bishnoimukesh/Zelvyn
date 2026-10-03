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
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className="min-h-screen bg-[#08080A] text-[#F2F2F5] flex font-sans selection:bg-[#C8FF47] selection:text-[#08080A]">
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
