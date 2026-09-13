import {
  User as UserIcon,
  ShieldCheck,
  Flame,
  Award,
  Edit3,
  Compass,
  Target,
  Smartphone,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  openEditProfileModal,
  openOnboardingModal,
} from "@/features/dashboard/userSlice";
import { PageContainer } from "@/components/layout/PageContainer";
import { BiometricsCard } from "@/components/profile/BiometricsCard";
import { ProfileEditModal } from "@/components/profile/ProfileEditModal";
import { OnboardingModal } from "@/components/profile/OnboardingModal";
import { ThemeToggle } from "@/components/common/ThemeToggle";

export function ProfilePage() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.user.profile);

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
      {/* Athlete Hero Header Card */}
      <Card className="border border-[#222228] bg-[#111115] p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl border-2 border-[#C8FF47] bg-[#1A1A1F] text-[#C8FF47] shadow-[0_0_20px_rgba(200,255,71,0.2)]">
                <UserIcon className="h-8 w-8 sm:h-10 sm:w-10" />
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#C8FF47] text-[10px] font-black text-[#08080A]">
                ✓
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-2xl sm:text-3xl font-black uppercase text-white">
                  {profile.name || "Alex Hunter"}
                </h2>
                <Badge variant="default" className="capitalize">
                  <ShieldCheck className="h-3 w-3 mr-1" />
                  {profile.fitnessLevel || "Intermediate"}
                </Badge>
              </div>
              <p className="text-xs text-[#71717A] mt-0.5 font-mono">
                {profile.email || "alex@fitsync.ai"} • Athlete ID: {profile.id || "FS-8821"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 rounded-xl border border-[#222228] bg-[#14141A] px-3.5 py-2 text-xs font-bold text-[#C8FF47] shadow-[0_0_10px_rgba(200,255,71,0.1)]">
              <Flame className="h-4 w-4 fill-current" />
              <span>5-Day Streak</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-xl border border-[#222228] bg-[#14141A] px-3.5 py-2 text-xs font-bold text-cyan-400">
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
        <Card className="border border-[#222228] bg-[#111115] p-5">
          <CardHeader className="p-0 pb-3 flex flex-row items-center justify-between">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#71717A]">
                Focus Area
              </span>
              <CardTitle className="font-display text-lg font-black uppercase text-white mt-0.5">
                Training Goal & Split
              </CardTitle>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C8FF47]/10 text-[#C8FF47]">
              <Target className="h-4 w-4" />
            </div>
          </CardHeader>

          <CardContent className="p-0 space-y-3 mt-2">
            <div className="rounded-lg border border-[#222228] bg-[#14141A] p-3.5">
              <span className="text-[10px] font-mono text-[#71717A] uppercase">
                Primary Goal
              </span>
              <p className="font-display text-lg font-bold text-[#C8FF47] mt-0.5">
                {profile.goal || "Hypertrophy & Muscle Gain"}
              </p>
              <p className="text-xs text-[#A1A1AA] mt-1 leading-relaxed">
                Tailored for muscle fiber recruitment, 8-12 rep targets, and adequate recovery between compound sessions.
              </p>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-[#222228] bg-[#14141A] p-3">
              <div>
                <span className="text-[10px] font-mono text-[#71717A] uppercase">
                  Activity Multiplier
                </span>
                <p className="text-xs font-bold text-white capitalize mt-0.5">
                  {profile.activityLevel || "Moderate"} Activity (3–5x / week)
                </p>
              </div>
              <span className="rounded bg-[#222228] px-2 py-0.5 text-[10px] font-mono text-[#C8FF47]">
                1.55x BMR
              </span>
            </div>
          </CardContent>
        </Card>

        {/* System & Display Settings */}
        <Card className="border border-[#222228] bg-[#111115] p-5">
          <CardHeader className="p-0 pb-3">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#71717A]">
              Application
            </span>
            <CardTitle className="font-display text-lg font-black uppercase text-white mt-0.5">
              Preferences & PWA
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0 space-y-3 mt-2">
            <div className="flex items-center justify-between rounded-lg border border-[#222228] bg-[#14141A] p-3">
              <div>
                <p className="text-xs font-bold text-white">Color Theme</p>
                <p className="text-[11px] text-[#71717A]">
                  Athletic obsidian dark mode or clean high-contrast
                </p>
              </div>
              <ThemeToggle showLabel className="w-auto" />
            </div>

            <div className="flex items-center justify-between rounded-lg border border-[#222228] bg-[#14141A] p-3">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-[#C8FF47]" />
                <div>
                  <p className="text-xs font-bold text-white">
                    FitSync PWA Ready
                  </p>
                  <p className="text-[11px] text-[#71717A]">
                    Offline caching and mobile home-screen install enabled
                  </p>
                </div>
              </div>
              <span className="h-2 w-2 rounded-full bg-[#C8FF47] shadow-[0_0_8px_rgba(200,255,71,0.8)]" />
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
