import React from "react";
import { Link } from "react-router-dom";
import { Menu, User } from "lucide-react";
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
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md px-4 sm:px-6 h-16 flex items-center justify-between transition-colors duration-200">
      {/* Brand & Mobile Hamburger */}
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Drawer Trigger */}
        <button
          type="button"
          onClick={() => dispatch(toggleMobileDrawer())}
          aria-label="Open mobile navigation menu"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-primary md:hidden transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
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
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-all hover:border-primary/50 hover:shadow-[0_0_10px_rgba(200,255,71,0.2)]"
        >
          <div className="relative flex h-7 w-7 items-center justify-center rounded-md bg-muted font-bold text-xs text-primary">
            <User className="h-4 w-4" />
          </div>
        </Link>
      </div>
    </header>
  );
};
