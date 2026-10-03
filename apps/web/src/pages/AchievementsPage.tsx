import { useEffect } from "react";
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
  Database,
  Sparkles,
  Award,
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  fetchGamification,
  unlockAchievementAsync,
} from "@/features/achievements/achievementsSlice";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Trophy,
  Flame,
  Footprints,
  TrendingUp,
  Sunrise,
  Dumbbell,
  Zap,
  Sparkles,
  Award,
};

export function AchievementsPage() {
  const dispatch = useAppDispatch();
  const authUserId = useAppSelector((state) => state.auth.userId);
  const userId = authUserId || "demo-user-1";

  const {
    level,
    title,
    currentXp,
    nextLevelXp,
    achievements,
    loading,
    source,
    isUnlocking,
  } = useAppSelector((state) => state.achievements);

  useEffect(() => {
    dispatch(fetchGamification(userId));
  }, [dispatch, userId]);

  const achievementList = Array.isArray(achievements) ? achievements : [];
  const earned = achievementList.filter((a) => a.unlocked);
  const locked = achievementList.filter((a) => !a.unlocked);

  const prevLevelBase = (level - 1) * 200;
  const xpInCurrentLevel = Math.max(0, currentXp - prevLevelBase);
  const xpNeededForCurrentLevel = Math.max(1, nextLevelXp - prevLevelBase);
  const xpProgressPercent = Math.min(
    100,
    Math.round((xpInCurrentLevel / xpNeededForCurrentLevel) * 100)
  );
  const xpToNextLevel = Math.max(0, nextLevelXp - currentXp);

  const handleUnlock = (achievementId: string) => {
    dispatch(unlockAchievementAsync({ userId, achievementId }));
  };

  return (
    <PageContainer
      title="Achievements"
      description={`${earned.length} / ${achievementList.length} unlocked`}
      badge="Gamification"
    >
      {/* Level XP Banner Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-lg flex flex-col sm:flex-row sm:items-center gap-6 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 blur-3xl pointer-events-none" />

        <div className="h-16 w-16 rounded-2xl bg-primary/10 border border-primary/30 flex flex-col items-center justify-center text-center shrink-0 shadow-[0_0_15px_rgba(200,255,71,0.15)]">
          <span className="font-display text-2xl font-black text-primary leading-none">
            {level}
          </span>
          <span className="text-[9px] uppercase font-bold text-muted-foreground mt-0.5">
            Level
          </span>
        </div>

        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div className="flex items-center gap-2">
              <h3 className="font-display text-lg font-black uppercase text-foreground tracking-wide">
                {title}
              </h3>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase border border-primary/30 bg-primary/10 text-primary">
                <Database className="h-2.5 w-2.5" />
                {source === "mongodb" ? "MongoDB Atlas" : "Local Sync"}
              </span>
            </div>
            <span className="text-xs text-muted-foreground font-mono">
              {currentXp.toLocaleString()} total XP earned
            </span>
          </div>

          {/* XP Progress */}
          <div className="space-y-1">
            <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(200,255,71,0.5)] transition-all duration-700 ease-out"
                style={{ width: `${xpProgressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
              <span>{xpProgressPercent}% to next tier</span>
              <span>{xpToNextLevel} XP to Level {level + 1}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && achievements.length === 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-44 rounded-2xl bg-card border border-border animate-pulse"
            />
          ))}
        </div>
      )}

      {/* EARNED SECTION */}
      <div className="space-y-3">
        <h4 className="text-xs font-black uppercase text-foreground tracking-wider flex items-center gap-1.5">
          <span>Earned ({earned.length})</span>
          <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {earned.map((item) => {
            const Icon = ICON_MAP[item.iconKey] || Trophy;

            return (
              <div
                key={item.id}
                className="rounded-2xl border border-border bg-card p-5 flex flex-col justify-between space-y-3 shadow-md hover:border-primary/40 transition-all"
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

                    <span className="text-[11px] font-mono text-muted-foreground">
                      {item.unlockedDate || "Unlocked"}
                    </span>
                  </div>

                  <h5 className="font-display text-sm font-black text-foreground mt-3">
                    {item.title}
                  </h5>

                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between">
                  <span className="text-xs font-bold font-mono text-primary">
                    +{item.xp} XP
                  </span>
                  <span className="text-[10px] text-muted-foreground font-semibold uppercase flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-primary" />
                    Unlocked
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* LOCKED SECTION */}
      {locked.length > 0 && (
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-black uppercase text-muted-foreground tracking-wider flex items-center gap-1.5">
            <span>Locked ({locked.length})</span>
            <Lock className="h-3 w-3 text-muted-foreground" />
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {locked.map((item) => {
              const Icon = ICON_MAP[item.iconKey] || Trophy;

              return (
                <div
                  key={item.id}
                  className="rounded-2xl border border-border/60 bg-card/60 p-5 flex flex-col justify-between space-y-3 opacity-75 hover:opacity-100 hover:border-border transition-all group"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0 border border-border bg-muted text-muted-foreground group-hover:text-foreground transition-colors">
                        <Icon className="h-5 w-5" />
                      </div>
                      <Lock className="h-4 w-4 text-muted-foreground/60" />
                    </div>

                    <h5 className="font-display text-sm font-black text-foreground/80 mt-3 group-hover:text-foreground">
                      {item.title}
                    </h5>

                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-border flex items-center justify-between">
                    <span className="text-xs font-bold font-mono text-muted-foreground">
                      +{item.xp} XP
                    </span>

                    <button
                      type="button"
                      disabled={isUnlocking}
                      onClick={() => handleUnlock(item.id)}
                      className="px-2.5 py-1 rounded-lg bg-muted hover:bg-primary hover:text-primary-foreground text-[10px] font-bold text-muted-foreground transition-colors border border-border"
                      title="Test unlock achievement"
                    >
                      Unlock +{item.xp} XP
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PageContainer>
  );
}
