import React from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Dumbbell,
  Calendar,
  LineChart,
  Bot,
  User,
  Zap,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/constants/routes";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Today", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: "Workouts", href: ROUTES.WORKOUTS, icon: Dumbbell },
  { label: "Planner", href: ROUTES.PLANNER, icon: Calendar },
  { label: "Progress", href: ROUTES.PROGRESS, icon: LineChart },
  { label: "AI Coach", href: ROUTES.COACH, icon: Bot },
  { label: "Profile", href: ROUTES.PROFILE, icon: User },
];

export function AppLayout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#08080A] text-[#F2F2F5] flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-[#222228] bg-[#08080A]/90 backdrop-blur-sm px-4 sm:px-6 h-14 flex items-center justify-between">
        <Link to={ROUTES.HOME} className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-[#C8FF47] flex items-center justify-center text-[#08080A] font-black">
            <Zap className="h-5 w-5 fill-current" />
          </div>
          <span className="font-display text-2xl font-black uppercase tracking-wider text-white">
            FIT<span className="text-[#C8FF47]">SYNC</span>
          </span>
        </Link>

        {/* Streak indicator badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full border border-[#C8FF47]/20 bg-[#C8FF47]/10 px-3 py-1 text-xs font-bold text-[#C8FF47]">
            <Flame className="h-3.5 w-3.5 fill-current" />
            <span>5 DAYS</span>
          </div>
        </div>
      </header>

      {/* Main Outlet Area with bottom padding for mobile navigation */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 pb-24 md:pb-12">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation Bar matching reference */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#222228] bg-[#08080A]/95 backdrop-blur-sm md:hidden">
        <div className="flex h-16 items-center justify-around px-2">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.href ||
              (item.href !== ROUTES.DASHBOARD && location.pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex flex-col items-center justify-center py-1 px-2.5 transition-colors",
                  isActive
                    ? "text-[#C8FF47] font-bold"
                    : "text-[#71717A] hover:text-[#F2F2F5]"
                )}
              >
                <Icon className={cn("h-5 w-5", isActive && "stroke-[2.5px]")} />
                <span className="mt-1 text-[10px] uppercase font-bold tracking-tight">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
