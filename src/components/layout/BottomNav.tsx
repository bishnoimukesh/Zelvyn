import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Dumbbell,
  Calendar,
  LineChart,
  Bot,
} from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

interface BottomNavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  isSpecial?: boolean;
}

const NAV_ITEMS: BottomNavItem[] = [
  { label: "Today", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: "Workouts", href: ROUTES.WORKOUTS, icon: Dumbbell },
  { label: "Planner", href: ROUTES.PLANNER, icon: Calendar },
  { label: "Progress", href: ROUTES.PROGRESS, icon: LineChart },
  { label: "AI Coach", href: ROUTES.COACH, icon: Bot, isSpecial: true },
];

export const BottomNav: React.FC = () => {
  const location = useLocation();

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#222228] bg-[#08080A]/95 backdrop-blur-md md:hidden transition-colors pb-[env(safe-area-inset-bottom,0px)]"
    >
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
                "relative flex flex-col items-center justify-center py-1 px-3 transition-all duration-150 active:scale-90",
                isActive
                  ? "text-[#C8FF47]"
                  : "text-[#71717A] hover:text-[#F2F2F5]"
              )}
            >
              {/* Active top glow indicator dot */}
              {isActive && (
                <span className="absolute -top-1 h-1 w-6 rounded-full bg-[#C8FF47] shadow-[0_0_8px_rgba(200,255,71,0.8)]" />
              )}

              <div
                className={cn(
                  "relative flex items-center justify-center rounded-lg p-1 transition-all",
                  item.isSpecial && !isActive && "text-[#A1A1AA]",
                  item.isSpecial && isActive && "bg-[#C8FF47]/10"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 transition-transform",
                    isActive && "stroke-[2.5px] scale-105"
                  )}
                />
              </div>

              <span
                className={cn(
                  "mt-0.5 text-[10px] uppercase tracking-wider transition-colors",
                  isActive ? "font-bold text-[#C8FF47]" : "font-semibold text-[#71717A]"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
