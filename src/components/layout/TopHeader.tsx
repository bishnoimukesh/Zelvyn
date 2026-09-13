import React from "react";
import { Link } from "react-router-dom";
import { Zap, Menu, User } from "lucide-react";
import { useAppDispatch } from "@/app/hooks";
import { toggleMobileDrawer } from "@/features/ui/uiSlice";
import { ROUTES } from "@/constants/routes";
import { StreakBadge } from "@/components/common/StreakBadge";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { NotificationPopover } from "@/components/common/NotificationPopover";

interface TopHeaderProps {
  onMenuClick?: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = () => {
  const dispatch = useAppDispatch();

  return (
    <header className="sticky top-0 z-40 border-b border-[#222228] bg-[#08080A]/90 backdrop-blur-md px-4 sm:px-6 h-16 flex items-center justify-between transition-colors">
      {/* Brand & Mobile Hamburger */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Drawer Trigger */}
        <button
          type="button"
          onClick={() => dispatch(toggleMobileDrawer())}
          aria-label="Open mobile navigation menu"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#222228] bg-[#111115] text-[#A1A1AA] hover:border-[#C8FF47]/40 hover:text-[#C8FF47] md:hidden transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Brand Logo */}
        <Link to={ROUTES.DASHBOARD} className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-lg bg-[#C8FF47] flex items-center justify-center text-[#08080A] font-black shadow-[0_0_12px_rgba(200,255,71,0.3)] transition-transform group-hover:scale-105">
            <Zap className="h-5 w-5 fill-current" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-2xl font-black uppercase tracking-wider text-white leading-none">
              FIT<span className="text-[#C8FF47]">SYNC</span>
            </span>
            <span className="text-[9px] font-mono tracking-widest text-[#71717A] uppercase leading-none mt-0.5 hidden sm:block">
              Athletic OS
            </span>
          </div>
        </Link>
      </div>

      {/* Right Actions: Streak, Notifications, Theme, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Athletic Workout Streak Badge */}
        <StreakBadge days={5} size="md" />

        {/* Notification Popover */}
        <NotificationPopover />

        {/* Theme Toggle Button */}
        <ThemeToggle className="hidden sm:flex" />

        {/* User Profile Avatar Link */}
        <Link
          to={ROUTES.PROFILE}
          aria-label="View Profile"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#222228] bg-[#111115] text-[#F2F2F5] transition-all hover:border-[#C8FF47]/50 hover:shadow-[0_0_10px_rgba(200,255,71,0.2)]"
        >
          <div className="relative flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-tr from-[#1A1A1F] to-[#222228] font-bold text-xs text-[#C8FF47]">
            <User className="h-4 w-4" />
          </div>
        </Link>
      </div>
    </header>
  );
};
