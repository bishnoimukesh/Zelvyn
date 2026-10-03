import { useEffect } from "react";
import {
  User as UserIcon,
  ShieldCheck,
  Flame,
  Award,
  Edit3,
  Compass,
  Target,
  Smartphone,
  RefreshCw,
  Database,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  openEditProfileModal,
  openOnboardingModal,
  fetchUserProfile,
} from "@/features/dashboard/userSlice";
import { PageContainer } from "@/components/layout/PageContainer";
import { BiometricsCard } from "@/components/profile/BiometricsCard";
import { ProfileEditModal } from "@/components/profile/ProfileEditModal";
import { OnboardingModal } from "@/components/profile/OnboardingModal";
import { ThemeToggle } from "@/components/common/ThemeToggle";

export function ProfilePage() {
  const dispatch = useAppDispatch();
  const { profile, loading, isLiveSynced } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchUserProfile(profile?.id || "demo-user-1"));
  }, [dispatch, profile?.id]);

  return (
    <PageContainer
      title="Athlete Profile"
      description="Manage your biometrics, target bodyweight, metabolic calculations, and training preferences."
      badge="Account"
      action={
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => dispatch(fetchUserProfile(profile?.id || "demo-user-1"))}
            disabled={loading}
            className="gap-1.5 text-xs font-semibold border-border hover:bg-muted"
            title="Refresh profile from MongoDB Atlas"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${
                loading ? "animate-spin text-primary" : "text-muted-foreground"
              }`}
            />
            {loading ? "Syncing..." : "Sync Profile"}
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => dispatch(openOnboardingModal())}
            className="gap-1.5 font-bold"
          >
            <Compass className="h-4 w-4" /> Retake Onboarding
          </Button>
          <Button
            size="sm"
            onClick={() => dispatch(openEditProfileModal())}
            className="gap-1.5 font-bold shadow-[0_0_12px_rgba(200,255,71,0.25)]"
          >
            <Edit3 className="h-4 w-4" /> Edit Profile
          </Button>
        </div>
      }
    >
      {/* Live Data Connectivity Status Banner */}
      <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-card border border-border mb-4">
        <div className="flex items-center gap-2">
          <div className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isLiveSynced ? "bg-emerald-500" : "bg-amber-400"
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2 w-2 ${
                isLiveSynced ? "bg-emerald-500" : "bg-amber-500"
              }`}
            />
          </div>
          <span className="text-xs font-medium text-muted-foreground">
            {isLiveSynced
              ? "Live Athlete Biometrics • MongoDB Atlas Synchronized"
              : "Connecting to Profile Database..."}
          </span>
        </div>
        <Badge
          variant="outline"
          className="text-[10px] font-mono border-emerald-500/30 text-emerald-500 bg-emerald-500/10 gap-1 py-0.5"
        >
          <Database className="h-3 w-3" />
          {isLiveSynced ? "MongoDB Atlas" : "Buffering"}
        </Badge>
      </div>
      {/* Athlete Hero Header Card */}
      <Card className="border border-border bg-card p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl border-2 border-primary bg-muted text-primary shadow-[0_0_20px_rgba(200,255,71,0.2)]">
                <UserIcon className="h-8 w-8 sm:h-10 sm:w-10" />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-black text-primary-foreground">
                ✓
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-2xl sm:text-3xl font-black uppercase text-foreground">
                  {profile.name || "Alex Hunter"}
                </h2>
                <Badge variant="default" className="capitalize">
                  <ShieldCheck className="h-3 w-3 mr-1" />
                  {profile.fitnessLevel || "Intermediate"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 font-mono">
                {profile.email || "alex@fitsync.ai"} • Athlete ID: {profile.id || "FS-8821"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 rounded-xl border border-border bg-muted/60 px-3.5 py-2 text-xs font-bold text-primary shadow-[0_0_10px_rgba(200,255,71,0.1)]">
              <Flame className="h-4 w-4 fill-current" />
              <span>5-Day Streak</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-xl border border-border bg-muted/60 px-3.5 py-2 text-xs font-bold text-cyan-400">
              <Award className="h-4 w-4" />
              <span>Pro Member</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Biometrics & Metabolic Breakdown */}
      <BiometricsCard user={profile} />

      {/* Training Focus & Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Goal & Activity Level */}
        <Card className="border border-border bg-card p-5">
          <CardHeader className="p-0 pb-3 flex flex-row items-center justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
                Focus Area
              </span>
              <CardTitle className="font-display text-lg font-black uppercase text-foreground mt-0.5">
                Training Goal & Split
              </CardTitle>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Target className="h-4 w-4" />
            </div>
          </CardHeader>

          <CardContent className="p-0 space-y-3 mt-2">
            <div className="rounded-lg border border-border bg-muted/60 p-3.5">
              <span className="text-[10px] font-mono text-muted-foreground uppercase">
                Primary Goal
              </span>
              <p className="font-display text-lg font-bold text-primary mt-0.5">
                {profile.goal || "Hypertrophy & Muscle Gain"}
              </p>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Tailored for muscle fiber recruitment, 8-12 rep targets, and adequate recovery between compound sessions.
              </p>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/60 p-3">
              <div>
                <span className="text-[10px] font-mono text-muted-foreground uppercase">
                  Activity Multiplier
                </span>
                <p className="text-xs font-bold text-foreground capitalize mt-0.5">
                  {profile.activityLevel || "Moderate"} Activity (3–5x / week)
                </p>
              </div>
              <span className="rounded bg-muted px-2 py-0.5 text-[10px] font-mono text-primary">
                1.55x BMR
              </span>
            </div>
          </CardContent>
        </Card>

        {/* System & Display Settings */}
        <Card className="border border-border bg-card p-5">
          <CardHeader className="p-0 pb-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
              Application
            </span>
            <CardTitle className="font-display text-lg font-black uppercase text-foreground mt-0.5">
              Preferences & PWA
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0 space-y-3 mt-2">
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/60 p-3">
              <div>
                <p className="text-xs font-bold text-foreground">Color Theme</p>
                <p className="text-[11px] text-muted-foreground">
                  Athletic obsidian dark mode or clean high-contrast
                </p>
              </div>
              <ThemeToggle showLabel className="w-auto" />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/60 p-3">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-primary" />
                <div>
                  <p className="text-xs font-bold text-foreground">
                    FitSync PWA Ready
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Offline caching and mobile home-screen install enabled
                  </p>
                </div>
              </div>
              <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_8px_rgba(200,255,71,0.8)]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <ProfileEditModal />
      <OnboardingModal />
    </PageContainer>
  );
}
