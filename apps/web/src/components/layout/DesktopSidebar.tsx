import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
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
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const MAIN_NAV_ITEMS: NavItem[] = [
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
];

const BOTTOM_NAV_ITEMS: NavItem[] = [
  { label: "Profile", href: ROUTES.PROFILE, icon: User },
  { label: "Settings", href: ROUTES.SETTINGS, icon: Settings },
];

import { useAppSelector } from "@/app/hooks";

export const DesktopSidebar: React.FC = () => {
  const location = useLocation();
  const user = useAppSelector((state) => state.user.profile);
  const { level, currentXp, nextLevelXp } = useAppSelector((state) => state.achievements);
  const streakCount = useAppSelector((state) => state.progress.streak?.current) ?? 12;

  const prevLevelBase = Math.max(0, (level - 1) * 200);
  const xpInLevel = Math.max(0, currentXp - prevLevelBase);
  const xpNeeded = Math.max(1, nextLevelXp - prevLevelBase);
  const xpPercent = Math.min(100, Math.round((xpInLevel / xpNeeded) * 100));

  return (
    <aside
      aria-label="Desktop Navigation Sidebar"
      className="hidden md:flex flex-col justify-between w-60 shrink-0 border-r border-[#1E1E24] bg-[#0A0A0C] h-screen sticky top-0 px-3 py-4 select-none overflow-hidden"
    >
      <div className="flex flex-col min-h-0 flex-1">
        {/* Brand Logo Header */}
        <Link
          to={ROUTES.DASHBOARD}
          className="flex items-center gap-2.5 px-3 py-2 group shrink-0"
        >
          <div className="h-8 w-8 rounded-lg bg-[#C8FF47] flex items-center justify-center text-black font-black shadow-[0_0_12px_rgba(200,255,71,0.4)] transition-transform group-hover:scale-105">
            <Zap className="h-4 w-4 fill-current" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-display text-lg font-black uppercase tracking-wider text-white">
              FITSYNC
            </span>
            <span className="text-xs font-black text-[#C8FF47] tracking-wider">
              AI
            </span>
          </div>
        </Link>

        {/* User Level & XP Header Card */}
        <div className="mt-3 px-3 py-2.5 border-b border-[#1E1E24] shrink-0">
          <Link
            to={ROUTES.PROFILE}
            className="flex items-center gap-2.5 group"
          >
            <img
              src={user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"}
              alt={user?.name || "Athlete"}
              className="h-9 w-9 rounded-full object-cover ring-2 ring-[#C8FF47]/40 group-hover:ring-[#C8FF47] transition-all"
            />
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate group-hover:text-[#C8FF47] transition-colors">
                {user?.name || "Alex Rivera"}
              </div>
              <div className="text-[11px] text-[#A1A1AA] flex items-center gap-1 mt-0.5">
                <span>Lv.{level || 12}</span>
                <span>·</span>
                <span className="text-[#FF8438] font-semibold flex items-center gap-0.5">
                  {streakCount} 🔥
                </span>
              </div>
            </div>
          </Link>

          {/* XP Progress Bar */}
          <div className="mt-2">
            <div className="flex justify-between text-[10px] text-[#71717A] font-mono mb-1">
              <span>{currentXp || 230} XP</span>
              <span>{nextLevelXp || 250} XP</span>
            </div>
            <div className="h-1.5 w-full bg-[#18181E] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#C8FF47] rounded-full transition-all duration-300 shadow-[0_0_8px_rgba(200,255,71,0.5)]"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Scrollable Main Navigation List */}
        <nav className="mt-2 space-y-0.5 overflow-y-auto flex-1 pr-1 scrollbar-thin scrollbar-thumb-[#222228]">
          {MAIN_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.href ||
              (item.href === ROUTES.CALENDAR &&
                location.pathname === ROUTES.PLANNER) ||
              (item.href !== ROUTES.DASHBOARD &&
                location.pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition-all duration-150",
                  isActive
                    ? "bg-[#182012] text-[#C8FF47] font-bold shadow-[0_0_12px_rgba(200,255,71,0.06)]"
                    : "text-[#A1A1AA] hover:bg-[#141418] hover:text-white"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    isActive
                      ? "text-[#C8FF47]"
                      : "text-[#71717A] group-hover:text-white"
                  )}
                />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Profile, Settings, & Sign Out */}
      <div className="border-t border-[#1E1E24] pt-2 mt-2 space-y-0.5 shrink-0">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition-all",
                isActive
                  ? "bg-[#182012] text-[#C8FF47] font-bold"
                  : "text-[#A1A1AA] hover:bg-[#141418] hover:text-white"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  isActive
                    ? "text-[#C8FF47]"
                    : "text-[#71717A] group-hover:text-white"
                )}
              />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}

        <button
          type="button"
          onClick={() => {
            window.location.href = "/";
          }}
          className="w-full flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium text-[#A1A1AA] hover:bg-[#201414] hover:text-[#FF453A] transition-all text-left"
        >
          <LogOut className="h-4 w-4 shrink-0 text-[#71717A] group-hover:text-[#FF453A]" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
