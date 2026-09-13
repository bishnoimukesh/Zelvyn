import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  X,
  LayoutDashboard,
  Dumbbell,
  Calendar,
  LineChart,
  Bot,
  Video,
  User,
  Zap,
  ShieldCheck,
  Flame,
  Smartphone,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setMobileDrawerOpen } from "@/features/ui/uiSlice";
import { ROUTES } from "@/constants/routes";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { cn } from "@/lib/utils";

interface DrawerItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

const DRAWER_ITEMS: DrawerItem[] = [
  { label: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: "Workout Library", href: ROUTES.WORKOUTS, icon: Dumbbell },
  { label: "Weekly Planner", href: ROUTES.PLANNER, icon: Calendar },
  { label: "Progress Analytics", href: ROUTES.PROGRESS, icon: LineChart },
  { label: "AI Fitness Coach", href: ROUTES.COACH, icon: Bot, badge: "AI" },
  { label: "Guided Videos", href: ROUTES.VIDEOS, icon: Video },
  { label: "Profile & Biometrics", href: ROUTES.PROFILE, icon: User },
];

export const MobileDrawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.mobileDrawerOpen);
  const location = useLocation();

  // Close drawer on route change
  useEffect(() => {
    dispatch(setMobileDrawerOpen(false));
  }, [location.pathname, dispatch]);

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => dispatch(setMobileDrawerOpen(false))}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <aside
        role="dialog"
        aria-label="Mobile Navigation Drawer"
        className="fixed inset-y-0 left-0 w-4/5 max-w-xs border-r border-[#222228] bg-[#0E0E12] flex flex-col justify-between p-5 shadow-2xl animate-in slide-in-from-left duration-200"
      >
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between border-b border-[#222228] pb-4">
            <Link
              to={ROUTES.DASHBOARD}
              onClick={() => dispatch(setMobileDrawerOpen(false))}
              className="flex items-center gap-2"
            >
              <div className="h-7 w-7 rounded-lg bg-[#C8FF47] flex items-center justify-center text-[#08080A] font-black">
                <Zap className="h-4 w-4 fill-current" />
              </div>
              <span className="font-display text-xl font-black uppercase tracking-wider text-white">
                FIT<span className="text-[#C8FF47]">SYNC</span>
              </span>
            </Link>
            <button
              type="button"
              onClick={() => dispatch(setMobileDrawerOpen(false))}
              aria-label="Close drawer"
              className="rounded-lg border border-[#222228] p-1.5 text-[#A1A1AA] hover:border-[#C8FF47]/40 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* User Status Card */}
          <div className="mt-4 rounded-xl border border-[#222228] bg-[#14141A] p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#222228] text-sm font-black text-[#C8FF47] border border-[#C8FF47]/20">
                AH
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-white truncate">
                    Alex Hunter
                  </span>
                  <ShieldCheck className="h-3.5 w-3.5 text-[#C8FF47] shrink-0" />
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-[#A1A1AA]">
                    Pro Athlete
                  </span>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-[#C8FF47]">
                    <Flame className="h-3 w-3 fill-current" /> 5d
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 space-y-1">
            {DRAWER_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.href ||
                (item.href !== ROUTES.DASHBOARD && location.pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-3 py-2.5 text-xs font-semibold uppercase tracking-wider transition-colors",
                    isActive
                      ? "border border-[#C8FF47]/30 bg-[#C8FF47]/10 text-[#C8FF47]"
                      : "text-[#A1A1AA] hover:bg-[#1A1A1F] hover:text-[#F2F2F5]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={cn("h-4 w-4", isActive && "stroke-[2.5px]")} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="rounded bg-[#C8FF47] px-1.5 py-0.5 text-[9px] font-black uppercase text-[#08080A]">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer actions: PWA status & Theme toggle */}
        <div className="border-t border-[#222228] pt-4 space-y-3">
          {/* PWA Ready indicator */}
          <div className="flex items-center justify-between px-2 text-[11px] text-[#71717A]">
            <div className="flex items-center gap-1.5">
              <Smartphone className="h-3.5 w-3.5 text-[#C8FF47]" />
              <span>FitSync PWA Ready</span>
            </div>
            <span className="h-2 w-2 rounded-full bg-[#C8FF47]" />
          </div>

          {/* Theme Toggle */}
          <ThemeToggle showLabel className="w-full justify-center" />
        </div>
      </aside>
    </div>
  );
};
