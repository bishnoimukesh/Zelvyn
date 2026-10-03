import React from "react";
import { Scale, Ruler, Flame, Activity, Zap } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { User } from "@/types";
import { getFullMetabolicProfile } from "@/lib/fitnessCalculations";

interface BiometricsCardProps {
  user: User;
}

export const BiometricsCard: React.FC<BiometricsCardProps> = ({ user }) => {
  const profile = getFullMetabolicProfile(
    user.weight || 70,
    user.height || 175,
    user.age || 26,
    user.gender || "male",
    user.activityLevel || "moderate",
    user.goal || "Hypertrophy"
  );

  return (
    <div className="space-y-4">
      {/* 4 Biometric Metric Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border border-[#222228] bg-[#111115] p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#71717A]">
              Height
            </span>
            <Ruler className="h-4 w-4 text-[#C8FF47]" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-display text-2xl sm:text-3xl font-black text-white">
              {user.height || 175}
            </span>
            <span className="text-xs font-mono text-[#71717A]">cm</span>
          </div>
        </Card>

        <Card className="border border-[#222228] bg-[#111115] p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#71717A]">
              Current Weight
            </span>
            <Scale className="h-4 w-4 text-[#C8FF47]" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-display text-2xl sm:text-3xl font-black text-white">
              {user.weight || 70}
            </span>
            <span className="text-xs font-mono text-[#71717A]">kg</span>
          </div>
        </Card>

        <Card className="border border-[#222228] bg-[#111115] p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#71717A]">
              Target Weight
            </span>
            <Activity className="h-4 w-4 text-cyan-400" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="font-display text-2xl sm:text-3xl font-black text-cyan-400">
              {user.targetWeight || 67}
            </span>
            <span className="text-xs font-mono text-[#71717A]">kg</span>
          </div>
        </Card>

        <Card className="border border-[#222228] bg-[#111115] p-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#71717A]">
              Body Mass (BMI)
            </span>
            <Zap className="h-4 w-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="font-display text-2xl sm:text-3xl font-black text-white">
              {profile.bmi.bmi}
            </span>
            <span className={`text-[10px] font-mono font-bold uppercase ${profile.bmi.badgeColor}`}>
              {profile.bmi.category}
            </span>
          </div>
        </Card>
      </div>

      {/* Metabolic Expenditure & Macro Split Card */}
      <Card className="border border-[#222228] bg-[#111115] p-5">
        <CardHeader className="p-0 pb-4 flex flex-row items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#71717A]">
              Metabolic Intelligence
            </span>
            <CardTitle className="font-display text-xl font-black uppercase text-white mt-0.5">
              Caloric Expenditure & Macronutrient Blueprint
            </CardTitle>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-[#C8FF47]/10 px-3 py-1 font-mono text-xs font-bold text-[#C8FF47]">
            <Flame className="h-3.5 w-3.5 fill-current" />
            <span>{profile.targetCalories} kcal / day</span>
          </div>
        </CardHeader>

        <CardContent className="p-0 space-y-4">
          {/* BMR vs TDEE Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 rounded-xl border border-[#222228] bg-[#14141A] p-3.5">
            <div>
              <p className="text-[10px] font-mono text-[#71717A] uppercase">
                Basal Metabolic Rate (BMR)
              </p>
              <p className="font-display text-xl font-black text-white mt-0.5">
                {profile.bmr} <span className="text-xs font-mono font-normal text-[#A1A1AA]">kcal/day</span>
              </p>
              <p className="text-[11px] text-[#71717A] mt-0.5">
                Baseline calories burned at complete rest
              </p>
            </div>
            <div>
              <p className="text-[10px] font-mono text-[#71717A] uppercase">
                Active Maintenance (TDEE)
              </p>
              <p className="font-display text-xl font-black text-[#C8FF47] mt-0.5">
                {profile.tdee} <span className="text-xs font-mono font-normal text-[#A1A1AA]">kcal/day</span>
              </p>
              <p className="text-[11px] text-[#71717A] mt-0.5">
                Total daily energy expenditure with {user.activityLevel || "moderate"} activity
              </p>
            </div>
          </div>

          {/* Daily Macronutrient Targets */}
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-[#A1A1AA] mb-2">
              <span className="uppercase font-bold text-white">Target Macro Split</span>
              <span>Goal: {user.goal || "Hypertrophy"}</span>
            </div>

            {/* Visual Macro Bar */}
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-[#1F1F26]">
              <div
                style={{
                  width: `${Math.round((profile.macros.proteinCalories / profile.targetCalories) * 100)}%`,
                }}
                className="bg-[#C8FF47]"
                title="Protein"
              />
              <div
                style={{
                  width: `${Math.round((profile.macros.carbsCalories / profile.targetCalories) * 100)}%`,
                }}
                className="bg-cyan-400"
                title="Carbohydrates"
              />
              <div
                style={{
                  width: `${Math.round((profile.macros.fatsCalories / profile.targetCalories) * 100)}%`,
                }}
                className="bg-amber-400"
                title="Fats"
              />
            </div>

            {/* Macro Labels */}
            <div className="grid grid-cols-3 gap-2 mt-3 pt-1 border-t border-[#222228] text-center">
              <div>
                <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-[#71717A] uppercase">
                  <span className="h-2 w-2 rounded-full bg-[#C8FF47]" />
                  <span>Protein (30%)</span>
                </div>
                <p className="font-mono text-sm font-bold text-white mt-0.5">
                  {profile.macros.proteinGrams}g
                </p>
              </div>

              <div>
                <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-[#71717A] uppercase">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" />
                  <span>Carbs (45%)</span>
                </div>
                <p className="font-mono text-sm font-bold text-white mt-0.5">
                  {profile.macros.carbsGrams}g
                </p>
              </div>

              <div>
                <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-[#71717A] uppercase">
                  <span className="h-2 w-2 rounded-full bg-amber-400" />
                  <span>Fats (25%)</span>
                </div>
                <p className="font-mono text-sm font-bold text-white mt-0.5">
                  {profile.macros.fatsGrams}g
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
