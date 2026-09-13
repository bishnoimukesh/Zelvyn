import { User as UserIcon, ShieldCheck, Flame, Award } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppSelector } from "@/app/hooks";
import { PageContainer } from "@/components/layout/PageContainer";
import { ThemeToggle } from "@/components/common/ThemeToggle";

export function ProfilePage() {
  const profile = useAppSelector((state) => state.user.profile);

  return (
    <PageContainer
      title="Athlete Profile"
      description="Manage biometrics, fitness targets, application preferences, and active tier."
      badge="Account"
    >
      <Card className="p-6 border-[#222228]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-[#1A1A1F] border-2 border-[#C8FF47] flex items-center justify-center text-[#C8FF47] shadow-[0_0_15px_rgba(200,255,71,0.2)]">
              <UserIcon className="h-8 w-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-2xl font-bold uppercase text-white">
                  {profile?.name || "Alex Hunter"}
                </h2>
                <Badge variant="default" className="flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  {profile?.fitnessLevel || "Intermediate"}
                </Badge>
              </div>
              <p className="text-xs text-[#71717A] mt-0.5">{profile?.email || "alex@fitsync.ai"}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 rounded-lg border border-[#222228] bg-[#14141A] px-3 py-1.5 text-xs font-bold text-[#C8FF47]">
              <Flame className="h-4 w-4 fill-current" />
              <span>5-Day Streak</span>
            </div>
            <div className="flex items-center gap-1.5 rounded-lg border border-[#222228] bg-[#14141A] px-3 py-1.5 text-xs font-bold text-cyan-400">
              <Award className="h-4 w-4" />
              <span>Pro Member</span>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="p-4 hover:border-[#C8FF47]/40 transition-colors">
          <span className="text-xs font-semibold text-[#71717A]">Height</span>
          <p className="font-display text-2xl font-black text-white mt-1">
            {profile?.height || 175} <span className="text-xs text-[#71717A] font-mono font-normal">cm</span>
          </p>
        </Card>

        <Card className="p-4 hover:border-[#C8FF47]/40 transition-colors">
          <span className="text-xs font-semibold text-[#71717A]">Weight</span>
          <p className="font-display text-2xl font-black text-white mt-1">
            {profile?.weight || 70} <span className="text-xs text-[#71717A] font-mono font-normal">kg</span>
          </p>
        </Card>

        <Card className="p-4 hover:border-[#C8FF47]/40 transition-colors">
          <span className="text-xs font-semibold text-[#71717A]">Target</span>
          <p className="font-display text-2xl font-black text-[#C8FF47] mt-1">
            {profile?.goal || "Hypertrophy"}
          </p>
        </Card>

        <Card className="p-4 hover:border-[#C8FF47]/40 transition-colors">
          <span className="text-xs font-semibold text-[#71717A]">Daily Calories</span>
          <p className="font-display text-2xl font-black text-white mt-1">
            2,200 <span className="text-xs text-[#71717A] font-mono font-normal">kcal</span>
          </p>
        </Card>
      </div>

      {/* Preferences & System Settings Card */}
      <Card className="p-5 border-[#222228] space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white">
          Display & Appearance
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Color Theme</p>
            <p className="text-xs text-[#71717A]">
              Switch between athletic obsidian dark mode and light theme
            </p>
          </div>
          <ThemeToggle showLabel className="w-auto" />
        </div>
      </Card>
    </PageContainer>
  );
}
