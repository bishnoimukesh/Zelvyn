import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  X,
  LayoutGrid,
  Dumbbell,
  Video,
  Bot,
  Apple,
  TrendingUp,
  Calendar,
  CheckSquare,
  Brain,
  HeartPulse,
  Trophy,
  Camera,
  Share2,
  User,
  Settings,
  LogOut,
  Zap,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setMobileDrawerOpen } from "@/features/ui/uiSlice";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

interface DrawerItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const DRAWER_ITEMS: DrawerItem[] = [
  { label: "Dashboard", href: ROUTES.DASHBOARD, icon: LayoutGrid },
  { label: "Workouts", href: ROUTES.WORKOUTS, icon: Dumbbell },
  { label: "Videos", href: ROUTES.VIDEOS, icon: Video },
  { label: "AI Coach", href: ROUTES.COACH, icon: Bot },
  { label: "Nutrition", href: ROUTES.NUTRITION, icon: Apple },
  { label: "Progress", href: ROUTES.PROGRESS, icon: TrendingUp },
  { label: "Calendar", href: ROUTES.CALENDAR, icon: Calendar },
  { label: "Habits", href: ROUTES.HABITS, icon: CheckSquare },
  { label: "Mindfulness", href: ROUTES.MINDFULNESS, icon: Brain },
  { label: "Health", href: ROUTES.HEALTH, icon: HeartPulse },
  { label: "Achievements", href: ROUTES.ACHIEVEMENTS, icon: Trophy },
  { label: "Form Check", href: ROUTES.FORM_CHECK, icon: Camera },
  { label: "Share", href: ROUTES.SOCIAL, icon: Share2 },
  { label: "Profile", href: ROUTES.PROFILE, icon: User },
  { label: "Settings", href: ROUTES.SETTINGS, icon: Settings },
];

export const MobileDrawer: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.mobileDrawerOpen);
  const location = useLocation();
  const user = useAppSelector((state) => state.user.profile);
  const { level, currentXp, nextLevelXp } = useAppSelector((state) => state.achievements);
  const streakCount = useAppSelector((state) => state.progress.streak?.current) ?? 12;

  const prevLevelBase = Math.max(0, (level - 1) * 200);
  const xpInLevel = Math.max(0, currentXp - prevLevelBase);
  const xpNeeded = Math.max(1, nextLevelXp - prevLevelBase);
  const xpPercent = Math.min(100, Math.round((xpInLevel / xpNeeded) * 100));

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
    <div className="fixed inset-0 z-50 md:hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={() => dispatch(setMobileDrawerOpen(false))}
      />

      {/* Slide-out Drawer Panel */}
      <div className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-[#0A0A0C] border-r border-[#1E1E24] p-4 flex flex-col justify-between shadow-2xl z-50">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-[#1E1E24]">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-[#C8FF47] flex items-center justify-center text-black font-black">
                <Zap className="h-4 w-4 fill-current" />
              </div>
              <span className="font-display text-lg font-black text-white">
                FITSYNC <span className="text-[#C8FF47]">AI</span>
              </span>
            </div>

            <button
              type="button"
              onClick={() => dispatch(setMobileDrawerOpen(false))}
              className="p-1.5 rounded-lg text-[#71717A] hover:bg-[#16161A] hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Card */}
          <div className="py-3 border-b border-[#1E1E24]">
            <div className="flex items-center gap-2.5">
              <img
                src={user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"}
                alt={user?.name || "Athlete"}
                className="h-9 w-9 rounded-full object-cover ring-2 ring-[#C8FF47]/40"
              />
              <div>
                <div className="text-xs font-bold text-white">{user?.name || "Alex Rivera"}</div>
                <div className="text-[11px] text-[#A1A1AA]">
                  Lv.{level || 12} · {streakCount} 🔥
                </div>
              </div>
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-[10px] text-[#71717A] font-mono mb-1">
                <span>{currentXp || 230} XP</span>
                <span>{nextLevelXp || 250} XP</span>
              </div>
              <div className="h-1.5 w-full bg-[#18181E] rounded-full overflow-hidden">
                <div className="h-full bg-[#C8FF47] rounded-full" style={{ width: `${xpPercent}%` }} />
              </div>
            </div>
          </div>

          {/* Nav items */}
          <nav className="mt-3 space-y-1 max-h-[58vh] overflow-y-auto pr-1">
            {DRAWER_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive =
                location.pathname === item.href ||
                (item.href === ROUTES.CALENDAR && location.pathname === ROUTES.PLANNER);

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all",
                    isActive
                      ? "bg-[#182012] text-[#C8FF47]"
                      : "text-[#A1A1AA] hover:bg-[#141418] hover:text-white"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4 w-4 shrink-0",
                      isActive ? "text-[#C8FF47]" : "text-[#71717A]"
                    )}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sign Out */}
        <div className="pt-3 border-t border-[#1E1E24]">
          <button
            type="button"
            onClick={() => {
              window.location.href = "/";
            }}
            className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold text-[#A1A1AA] hover:text-[#FF453A]"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};
