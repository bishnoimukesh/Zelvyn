import React, { useState, useEffect } from "react";
import { X, Save, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  closeEditProfileModal,
  updateUserProfile,
} from "@/features/dashboard/userSlice";

const FITNESS_LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
] as const;

const FITNESS_GOALS = [
  "Hypertrophy & Muscle Gain",
  "Fat Loss & Definition",
  "Endurance & Conditioning",
  "Athletic Power & Strength",
];

const ACTIVITY_LEVELS = [
  { value: "sedentary", label: "Sedentary (desk job)" },
  { value: "light", label: "Light (1-2 workouts/wk)" },
  { value: "moderate", label: "Moderate (3-5 workouts/wk)" },
  { value: "very_active", label: "Very Active (6+ intense workouts/wk)" },
] as const;

export const ProfileEditModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.user.isEditProfileModalOpen);
  const profile = useAppSelector((state) => state.user.profile);

  const [formData, setFormData] = useState({
    name: "",
    height: 175,
    weight: 70,
    targetWeight: 67,
    age: 26,
    gender: "male" as "male" | "female" | "other",
    fitnessLevel: "intermediate" as "beginner" | "intermediate" | "advanced",
    goal: "Hypertrophy & Muscle Gain",
    activityLevel: "moderate" as "sedentary" | "light" | "moderate" | "very_active",
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        height: profile.height || 175,
        weight: profile.weight || 70,
        targetWeight: profile.targetWeight || 67,
        age: profile.age || 26,
        gender: profile.gender || "male",
        fitnessLevel: profile.fitnessLevel || "intermediate",
        goal: profile.goal || "Hypertrophy & Muscle Gain",
        activityLevel: profile.activityLevel || "moderate",
      });
    }
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateUserProfile(formData));
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      dispatch(closeEditProfileModal());
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => dispatch(closeEditProfileModal())}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg rounded-2xl border border-[#222228] bg-[#0E0E12] p-6 shadow-2xl z-50 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#222228] pb-4">
          <div>
            <h3 className="font-display text-xl font-black uppercase tracking-wide text-white">
              Edit Athlete Profile
            </h3>
            <p className="text-xs text-[#71717A]">
              Update your biometrics and athletic training preferences
            </p>
          </div>
          <button
            type="button"
            onClick={() => dispatch(closeEditProfileModal())}
            aria-label="Close edit modal"
            className="rounded-lg border border-[#222228] p-1 text-[#A1A1AA] hover:border-[#C8FF47]/40 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Full Name */}
          <div>
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#A1A1AA]">
              Athlete Name
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1"
              required
            />
          </div>

          {/* Biometrics Grid: Height, Weight, Target Weight, Age */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[11px] font-mono font-bold uppercase text-[#A1A1AA]">
                Height (cm)
              </label>
              <Input
                type="number"
                value={formData.height}
                onChange={(e) =>
                  setFormData({ ...formData, height: Number(e.target.value) })
                }
                className="mt-1"
                min={100}
                max={250}
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-mono font-bold uppercase text-[#A1A1AA]">
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
                min={30}
                max={250}
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-mono font-bold uppercase text-[#A1A1AA]">
                Target (kg)
              </label>
              <Input
                type="number"
                step="0.5"
                value={formData.targetWeight}
                onChange={(e) =>
                  setFormData({ ...formData, targetWeight: Number(e.target.value) })
                }
                className="mt-1"
                min={30}
                max={250}
                required
              />
            </div>

            <div>
              <label className="text-[11px] font-mono font-bold uppercase text-[#A1A1AA]">
                Age
              </label>
              <Input
                type="number"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: Number(e.target.value) })
                }
                className="mt-1"
                min={14}
                max={100}
                required
              />
            </div>
          </div>

          {/* Fitness Experience Level */}
          <div>
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#A1A1AA]">
              Athletic Experience Level
            </label>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {FITNESS_LEVELS.map((lvl) => (
                <button
                  key={lvl.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, fitnessLevel: lvl.value })}
                  className={`rounded-lg border p-2.5 text-xs font-bold uppercase tracking-wide transition-all ${
                    formData.fitnessLevel === lvl.value
                      ? "border-[#C8FF47] bg-[#C8FF47]/10 text-[#C8FF47] shadow-[0_0_10px_rgba(200,255,71,0.15)]"
                      : "border-[#222228] bg-[#14141A] text-[#A1A1AA] hover:text-white"
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          {/* Primary Fitness Goal */}
          <div>
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#A1A1AA]">
              Primary Training Goal
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
              {FITNESS_GOALS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setFormData({ ...formData, goal: g })}
                  className={`rounded-lg border p-2.5 text-left text-xs font-semibold transition-all ${
                    formData.goal === g
                      ? "border-[#C8FF47] bg-[#C8FF47]/10 text-[#C8FF47]"
                      : "border-[#222228] bg-[#14141A] text-[#A1A1AA] hover:text-white"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          {/* Activity Level */}
          <div>
            <label className="text-xs font-mono font-bold uppercase tracking-wider text-[#A1A1AA]">
              Daily Activity & Training Frequency
            </label>
            <select
              value={formData.activityLevel}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  activityLevel: e.target.value as typeof formData.activityLevel,
                })
              }
              className="mt-1 w-full rounded-lg border border-[#222228] bg-[#111115] px-3 py-2 text-xs text-white focus:border-[#C8FF47] focus:outline-none"
            >
              {ACTIVITY_LEVELS.map((act) => (
                <option key={act.value} value={act.value} className="bg-[#111115] text-white">
                  {act.label}
                </option>
              ))}
            </select>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#222228]">
            <Button
              type="button"
              variant="outline"
              onClick={() => dispatch(closeEditProfileModal())}
            >
              Cancel
            </Button>
            <Button type="submit" className="gap-1.5 font-bold shadow-[0_0_12px_rgba(200,255,71,0.25)]">
              {savedSuccess ? (
                <>
                  <Check className="h-4 w-4 text-[#08080A]" /> Saved!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" /> Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
