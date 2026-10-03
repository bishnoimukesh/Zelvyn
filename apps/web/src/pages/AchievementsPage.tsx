import {
  Trophy,
  Flame,
  Footprints,
  TrendingUp,
  Sunrise,
  Dumbbell,
  Zap,
  CheckCircle2,
  Lock,
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";

interface Achievement {
  id: string;
  title: string;
  description: string;
  xp: number;
  unlocked: boolean;
  unlockedDate?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const ACHIEVEMENTS: Achievement[] = [
  // Earned (6)
  {
    id: "first_workout",
    title: "First Workout",
    description: "Complete your very first workout",
    xp: 50,
    unlocked: true,
    unlockedDate: "Jul 9",
    icon: Trophy,
    color: "#F59E0B",
  },
  {
    id: "streak_7",
    title: "7-Day Streak",
    description: "Work out 7 days in a row",
    xp: 150,
    unlocked: true,
    unlockedDate: "Aug 15",
    icon: Flame,
    color: "#FF8438",
  },
  {
    id: "steps_10k",
    title: "10K Steps",
    description: "Hit 10,000 steps in a single day",
    xp: 100,
    unlocked: true,
    unlockedDate: "Aug 30",
    icon: Footprints,
    color: "#A78BFA",
  },
  {
    id: "new_pr",
    title: "New PR",
    description: "Set a new personal record",
    xp: 200,
    unlocked: true,
    unlockedDate: "Sep 6",
    icon: TrendingUp,
    color: "#00F0FF",
  },
  {
    id: "early_bird",
    title: "Early Bird",
    description: "Complete 10 morning workouts",
    xp: 150,
    unlocked: true,
    unlockedDate: "Aug 25",
    icon: Sunrise,
    color: "#F97316",
  },
  {
    id: "iron_will",
    title: "Iron Will",
    description: "Complete a workout with 5000kg+ total volume",
    xp: 300,
    unlocked: true,
    unlockedDate: "Sep 9",
    icon: Dumbbell,
    color: "#C8FF47",
  },
  // Locked (4)
  {
    id: "streak_30",
    title: "30-Day Streak",
    description: "Work out 30 days in a row",
    xp: 300,
    unlocked: false,
    icon: Zap,
    color: "#71717A",
  },
  {
    id: "workouts_100",
    title: "100 Workouts",
    description: "Complete 100 total workouts",
    xp: 500,
    unlocked: false,
    icon: Trophy,
    color: "#71717A",
  },
  {
    id: "nutrition_tracker",
    title: "Nutrition Tracker",
    description: "Log meals for 7 consecutive days",
    xp: 150,
    unlocked: false,
    icon: Flame,
    color: "#71717A",
  },
  {
    id: "century_club",
    title: "Century Club",
    description: "Bench press or deadlift 100kg milestone",
    xp: 500,
    unlocked: false,
    icon: Dumbbell,
    color: "#71717A",
  },
];

export function AchievementsPage() {
  const earned = ACHIEVEMENTS.filter((a) => a.unlocked);
  const locked = ACHIEVEMENTS.filter((a) => !a.unlocked);

  return (
    <PageContainer
      title="Achievements"
      description={`${earned.length} / ${ACHIEVEMENTS.length} unlocked`}
      badge="Gamification"
    >
      {/* Level XP Banner Card */}
      <div className="rounded-2xl border border-[#1E1E24] bg-[#111114] p-6 shadow-lg flex flex-col sm:flex-row sm:items-center gap-6">
        <div className="h-16 w-16 rounded-2xl bg-[#C8FF47]/10 border border-[#C8FF47]/30 flex flex-col items-center justify-center text-center shrink-0">
          <span className="font-display text-2xl font-black text-[#C8FF47] leading-none">
            12
          </span>
          <span className="text-[9px] uppercase font-bold text-[#A1A1AA] mt-0.5">
            Level
          </span>
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-black uppercase text-white tracking-wide">
              Fitness Explorer
            </h3>
            <span className="text-xs text-[#A1A1AA] font-mono">
              2,480 total XP earned
            </span>
          </div>

          {/* XP Progress */}
          <div className="space-y-1">
            <div className="h-2 w-full bg-[#181820] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#C8FF47] rounded-full shadow-[0_0_10px_rgba(200,255,71,0.5)]"
                style={{ width: "92%" }}
              />
            </div>
            <div className="text-[10px] font-mono text-[#71717A] text-right">
              20 XP to Level 13
            </div>
          </div>
        </div>
      </div>

      {/* EARNED (6) SECTION */}
      <div className="space-y-3">
        <h4 className="text-xs font-black uppercase text-white tracking-wider flex items-center gap-1.5">
          <span>Earned ({earned.length})</span>
          <CheckCircle2 className="h-3.5 w-3.5 text-[#C8FF47]" />
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {earned.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className="rounded-2xl border border-[#1E1E24] bg-[#111114] p-5 flex flex-col justify-between space-y-3 shadow-md hover:border-[#2E2E38] transition-all"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div
                      className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border"
                      style={{
                        backgroundColor: `${item.color}15`,
                        borderColor: `${item.color}30`,
                        color: item.color,
                      }}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    <span className="text-[11px] font-mono text-[#71717A]">
                      {item.unlockedDate}
                    </span>
                  </div>

                  <h5 className="font-display text-sm font-black text-white mt-3">
                    {item.title}
                  </h5>

                  <p className="text-xs text-[#A1A1AA] mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#1C1C24] flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-[#C8FF47]">
                    +{item.xp} XP
                  </span>
                  <span className="text-[10px] text-[#71717A] font-semibold uppercase">
                    Unlocked
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* LOCKED (4) SECTION */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-black uppercase text-[#71717A] tracking-wider flex items-center gap-1.5">
          <span>Locked ({locked.length})</span>
          <Lock className="h-3 w-3 text-[#71717A]" />
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {locked.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.id}
                className="rounded-2xl border border-[#1A1A20] bg-[#0E0E12]/60 p-5 flex flex-col justify-between space-y-3 opacity-60 hover:opacity-80 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border border-[#222228] bg-[#16161A] text-[#71717A]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <Lock className="h-4 w-4 text-[#52525B]" />
                  </div>

                  <h5 className="font-display text-sm font-black text-[#D4D4D8] mt-3">
                    {item.title}
                  </h5>

                  <p className="text-xs text-[#71717A] mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#1A1A22] flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-[#A1A1AA]">
                    +{item.xp} XP
                  </span>
                  <span className="text-[10px] text-[#52525B] font-semibold uppercase">
                    Locked
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </PageContainer>
  );
}
