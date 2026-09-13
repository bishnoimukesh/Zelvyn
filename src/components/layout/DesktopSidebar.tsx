import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
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
} from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { cn } from "@/lib/utils";

interface NavLinkItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface NavGroup {
  title: string;
  items: NavLinkItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: "Core Training",
    items: [
      { label: "Today", href: ROUTES.DASHBOARD, icon: LayoutDashboard },
      { label: "Workouts", href: ROUTES.WORKOUTS, icon: Dumbbell },
      { label: "Planner", href: ROUTES.PLANNER, icon: Calendar },
      { label: "Progress", href: ROUTES.PROGRESS, icon: LineChart },
    ],
  },
  {
    title: "Intelligence",
    items: [
      { label: "AI Fitness Coach", href: ROUTES.COACH, icon: Bot, badge: "AI" },
      { label: "Guided Videos", href: ROUTES.VIDEOS, icon: Video },
    ],
  },
  {
    title: "Account",
    items: [{ label: "Profile & Goals", href: ROUTES.PROFILE, icon: User }],
  },
];

export const DesktopSidebar: React.FC = () => {
  const location = useLocation();

  return (
    <aside
      aria-label="Desktop Sidebar"
      className="hidden md:flex flex-col justify-between w-64 shrink-0 border-r border-[#222228] bg-[#0A0A0D] h-screen sticky top-0 px-4 py-5 select-none"
    >
      <div>
        {/* Brand Header */}
        <Link to={ROUTES.DASHBOARD} className="flex items-center gap-2.5 px-2 group">
          <div className="h-9 w-9 rounded-xl bg-[#C8FF47] flex items-center justify-center text-[#08080A] font-black shadow-[0_0_15px_rgba(200,255,71,0.35)] transition-transform group-hover:scale-105">
            <Zap className="h-5 w-5 fill-current" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-2xl font-black uppercase tracking-wider text-white leading-none">
              FIT<span className="text-[#C8FF47]">SYNC</span>
            </span>
            <span className="text-[9px] font-mono tracking-widest text-[#71717A] uppercase leading-none mt-1">
              Adaptive Athletic OS
            </span>
          </div>
        </Link>

        {/* Grouped Navigation Links */}
        <div className="mt-8 space-y-6">
          {NAV_GROUPS.map((group) => (
            <div key={group.title}>
              <h4 className="px-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[#52525B]">
                {group.title}
              </h4>
              <nav className="mt-2 space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    location.pathname === item.href ||
                    (item.href !== ROUTES.DASHBOARD && location.pathname.startsWith(item.href));

                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={cn(
                        "group relative flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-150",
                        isActive
                          ? "bg-[#C8FF47]/10 text-[#C8FF47] border border-[#C8FF47]/25 shadow-[0_0_12px_rgba(200,255,71,0.08)]"
                          : "text-[#A1A1AA] hover:bg-[#14141A] hover:text-[#F2F2F5]"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={cn(
                            "h-4 w-4 transition-colors",
                            isActive ? "text-[#C8FF47] stroke-[2.5px]" : "text-[#71717A] group-hover:text-[#F2F2F5]"
                          )}
                        />
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
          ))}
        </div>
      </div>

      {/* Footer User Profile & Theme Toggle */}
      <div className="border-t border-[#222228] pt-4 space-y-3">
        {/* User Card */}
        <Link
          to={ROUTES.PROFILE}
          className="flex items-center gap-3 rounded-xl border border-[#222228] bg-[#111115] p-2.5 transition-all hover:border-[#C8FF47]/30 hover:bg-[#14141A]"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#1F1F26] text-xs font-black text-[#C8FF47] border border-[#C8FF47]/20">
            AH
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-white truncate">
                Alex Hunter
              </span>
              <ShieldCheck className="h-3 w-3 text-[#C8FF47] shrink-0" />
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] text-[#71717A] font-mono uppercase">
                Pro
              </span>
              <span className="flex items-center gap-0.5 text-[10px] font-bold text-[#C8FF47]">
                <Flame className="h-3 w-3 fill-current" /> 5d
              </span>
            </div>
          </div>
        </Link>

        {/* Theme Toggle Button */}
        <ThemeToggle showLabel className="w-full justify-center" />
      </div>
    </aside>
  );
};
