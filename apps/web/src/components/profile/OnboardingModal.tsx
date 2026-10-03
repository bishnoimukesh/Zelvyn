import React, { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Dumbbell,
  Target,
  Flame,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  closeOnboardingModal,
  completeOnboardingAsync,
} from "@/features/dashboard/userSlice";
import { getFullMetabolicProfile } from "@/lib/fitnessCalculations";

const FITNESS_LEVELS = [
  {
    id: "beginner",
    title: "Beginner",
    tag: "0–1 Year",
    desc: "Learning fundamental movement mechanics, building consistency, and developing baseline aerobic capacity.",
  },
  {
    id: "intermediate",
    title: "Intermediate",
    tag: "1–3 Years",
    desc: "Consistent progressive overload experience, familiar with compound movements and volume periodization.",
  },
  {
    id: "advanced",
    title: "Advanced",
    tag: "3+ Years",
    desc: "High training tolerance, specialized splits, tracking velocity, and optimizing peak athletic conditioning.",
  },
] as const;

const FITNESS_GOALS = [
  {
    id: "Hypertrophy & Muscle Gain",
    title: "Hypertrophy & Muscle Gain",
    desc: "Calorie surplus focused on myofibrillar growth, progressive volume, and lean muscle mass accretion.",
    icon: Dumbbell,
  },
  {
    id: "Fat Loss & Definition",
    title: "Fat Loss & Lean Definition",
    desc: "Calorie deficit prioritizing fat oxidation while preserving metabolically active muscle tissue.",
    icon: Flame,
  },
  {
    id: "Endurance & Conditioning",
    title: "Endurance & Conditioning",
    desc: "Optimizing VO2 max, mitochondrial density, and lactate threshold through interval and hybrid training.",
    icon: Zap,
  },
  {
    id: "Athletic Power & Strength",
    title: "Athletic Power & Strength",
    desc: "Neuromuscular adaptation, rate of force development (RFD), and maximal compound strength.",
    icon: Target,
  },
];

export const OnboardingModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.user.isOnboardingModalOpen);
  const profile = useAppSelector((state) => state.user.profile);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: profile.name || "Alex Hunter",
    height: profile.height || 175,
    weight: profile.weight || 70,
    targetWeight: profile.targetWeight || 67,
    age: profile.age || 26,
    gender: profile.gender || ("male" as "male" | "female" | "other"),
    fitnessLevel: profile.fitnessLevel || ("intermediate" as "beginner" | "intermediate" | "advanced"),
    goal: profile.goal || "Hypertrophy & Muscle Gain",
    activityLevel: profile.activityLevel || ("moderate" as "sedentary" | "light" | "moderate" | "very_active"),
  });

  if (!isOpen) return null;

  const metabolic = getFullMetabolicProfile(
    formData.weight,
    formData.height,
    formData.age,
    formData.gender,
    formData.activityLevel,
    formData.goal
  );

  const handleComplete = () => {
    dispatch(
      completeOnboardingAsync({
        userId: profile.id || "demo-user-1",
        data: formData,
      })
    );
    setStep(1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={() => dispatch(closeOnboardingModal())}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-2xl z-50 max-h-[90vh] overflow-y-auto">
        {/* Step Progress Header */}
        <div className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-primary">
              Athlete Onboarding • Step {step} of 4
            </span>
            <button
              type="button"
              onClick={() => dispatch(closeOnboardingModal())}
              className="text-xs text-muted-foreground hover:text-foreground font-mono"
            >
              Skip
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-2.5 flex h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              style={{ width: `${(step / 4) * 100}%` }}
              className="bg-primary transition-all duration-300 shadow-[0_0_10px_rgba(200,255,71,0.5)]"
            />
          </div>
        </div>

        {/* Step Content */}
        <div className="mt-6 min-h-[320px]">
          {/* STEP 1: Biometrics */}
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <h3 className="font-display text-2xl font-black uppercase text-foreground">
                  Athlete Biometrics
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Accurate baseline metrics enable precise energy balance and volume calculation.
                </p>
              </div>

              <div>
                <label className="text-xs font-mono font-bold uppercase text-muted-foreground">
                  Your Name
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[11px] font-mono font-bold uppercase text-muted-foreground">
                    Height (cm)
                  </label>
                  <Input
                    type="number"
                    value={formData.height}
                    onChange={(e) =>
                      setFormData({ ...formData, height: Number(e.target.value) })
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono font-bold uppercase text-muted-foreground">
                    Weight (kg)
                  </label>
                  <Input
                    type="number"
                    step="0.5"
                    value={formData.weight}
                    onChange={(e) =>
                      setFormData({ ...formData, weight: Number(e.target.value) })
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono font-bold uppercase text-muted-foreground">
                    Target (kg)
                  </label>
                  <Input
                    type="number"
                    step="0.5"
                    value={formData.targetWeight}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        targetWeight: Number(e.target.value),
                      })
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-mono font-bold uppercase text-muted-foreground">
                    Age
                  </label>
                  <Input
                    type="number"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: Number(e.target.value) })
                    }
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Fitness Level */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <h3 className="font-display text-2xl font-black uppercase text-foreground">
                  Athletic Experience
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Select your current training experience level to tailor routine complexity.
                </p>
              </div>

              <div className="space-y-3">
                {FITNESS_LEVELS.map((lvl) => (
                  <div
                    key={lvl.id}
                    onClick={() =>
                      setFormData({ ...formData, fitnessLevel: lvl.id })
                    }
                    className={`rounded-xl border p-4 cursor-pointer transition-all ${
                      formData.fitnessLevel === lvl.id
                        ? "border-primary bg-primary/10 shadow-[0_0_15px_rgba(200,255,71,0.12)]"
                        : "border-border bg-muted/60 hover:border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display text-lg font-bold uppercase text-foreground">
                        {lvl.title}
                      </span>
                      <span className="rounded-md border border-border bg-muted px-2 py-0.5 text-[10px] font-mono font-bold text-primary">
                        {lvl.tag}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {lvl.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Fitness Goal */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <h3 className="font-display text-2xl font-black uppercase text-foreground">
                  Primary Fitness Target
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  What is your primary training focus for the upcoming 12 weeks?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {FITNESS_GOALS.map((g) => {
                  const Icon = g.icon;
                  const isSelected = formData.goal === g.id;

                  return (
                    <div
                      key={g.id}
                      onClick={() => setFormData({ ...formData, goal: g.id })}
                      className={`rounded-xl border p-4 cursor-pointer transition-all flex flex-col justify-between ${
                        isSelected
                          ? "border-primary bg-primary/10 shadow-[0_0_15px_rgba(200,255,71,0.12)]"
                          : "border-border bg-muted/60 hover:border-border"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className={`p-2 rounded-lg ${
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-primary"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="font-display text-base font-bold uppercase text-foreground">
                          {g.title}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {g.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 4: Metabolic Blueprint & Macro Summary */}
          {step === 4 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div>
                <h3 className="font-display text-2xl font-black uppercase text-foreground">
                  Metabolic Blueprint
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Calculated using the Mifflin-St Jeor equation and athletic activity multiplier.
                </p>
              </div>

              {/* Calculated Stats Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl border border-border bg-muted/60 p-3 text-center">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase">
                    BMI Status
                  </span>
                  <p className="font-display text-xl font-black text-foreground mt-1">
                    {metabolic.bmi.bmi}
                  </p>
                  <span className={`text-[10px] font-bold uppercase ${metabolic.bmi.badgeColor}`}>
                    {metabolic.bmi.category}
                  </span>
                </div>

                <div className="rounded-xl border border-border bg-muted/60 p-3 text-center">
                  <span className="text-[10px] font-mono text-muted-foreground uppercase">
                    Basal BMR
                  </span>
                  <p className="font-display text-xl font-black text-foreground mt-1">
                    {metabolic.bmr}
                  </p>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    kcal / day
                  </span>
                </div>

                <div className="rounded-xl border border-primary/30 bg-primary/10 p-3 text-center shadow-[0_0_12px_rgba(200,255,71,0.1)]">
                  <span className="text-[10px] font-mono text-primary uppercase font-bold">
                    Target Daily
                  </span>
                  <p className="font-display text-xl font-black text-primary mt-1">
                    {metabolic.targetCalories}
                  </p>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    kcal / day
                  </span>
                </div>
              </div>

              {/* Macro Preview */}
              <div className="rounded-xl border border-border bg-muted/60 p-4 space-y-3">
                <span className="text-xs font-mono font-bold uppercase text-foreground">
                  Target Daily Macros
                </span>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded-lg bg-muted">
                    <span className="text-[10px] font-mono text-primary">
                      Protein
                    </span>
                    <p className="font-mono text-base font-black text-foreground">
                      {metabolic.macros.proteinGrams}g
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-muted">
                    <span className="text-[10px] font-mono text-cyan-400">
                      Carbs
                    </span>
                    <p className="font-mono text-base font-black text-foreground">
                      {metabolic.macros.carbsGrams}g
                    </p>
                  </div>
                  <div className="p-2 rounded-lg bg-muted">
                    <span className="text-[10px] font-mono text-amber-400">
                      Fats
                    </span>
                    <p className="font-mono text-base font-black text-foreground">
                      {metabolic.macros.fatsGrams}g
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="flex items-center justify-between pt-5 border-t border-border mt-6">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="gap-1.5"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <Button
              type="button"
              onClick={() => setStep(step + 1)}
              className="gap-1.5 font-bold shadow-[0_0_12px_rgba(200,255,71,0.25)]"
            >
              Next Step <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleComplete}
              className="gap-1.5 font-bold shadow-[0_0_15px_rgba(200,255,71,0.4)]"
            >
              <CheckCircle2 className="h-4 w-4 text-primary-foreground" /> Complete Onboarding
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
