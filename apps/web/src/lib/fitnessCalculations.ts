/**
 * Fitness, Biometric, and Metabolic Calculation Utilities
 */

export interface BMISummary {
  bmi: number;
  category: "Underweight" | "Optimal" | "Overweight" | "High Body Mass";
  badgeColor: string;
}

export interface MacroBreakdown {
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  proteinCalories: number;
  carbsCalories: number;
  fatsCalories: number;
}

export interface MetabolicProfile {
  bmi: BMISummary;
  bmr: number;
  tdee: number;
  targetCalories: number;
  macros: MacroBreakdown;
}

export function calculateBMI(weightKg: number, heightCm: number): BMISummary {
  if (!weightKg || !heightCm || heightCm <= 0) {
    return { bmi: 22.5, category: "Optimal", badgeColor: "text-[#C8FF47]" };
  }
  const heightM = heightCm / 100;
  const bmi = Number((weightKg / (heightM * heightM)).toFixed(1));

  let category: BMISummary["category"] = "Optimal";
  let badgeColor = "text-[#C8FF47]";

  if (bmi < 18.5) {
    category = "Underweight";
    badgeColor = "text-amber-400";
  } else if (bmi <= 24.9) {
    category = "Optimal";
    badgeColor = "text-[#C8FF47]";
  } else if (bmi <= 29.9) {
    category = "Overweight";
    badgeColor = "text-orange-400";
  } else {
    category = "High Body Mass";
    badgeColor = "text-rose-400";
  }

  return { bmi, category, badgeColor };
}

export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number = 26,
  gender: string = "male"
): number {
  if (!weightKg || !heightCm) return 1750;
  // Mifflin-St Jeor Equation
  if (gender === "female") {
    return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age - 161);
  }
  return Math.round(10 * weightKg + 6.25 * heightCm - 5 * age + 5);
}

export function calculateTDEE(
  bmr: number,
  activityLevel: string = "moderate",
  goal: string = "Hypertrophy"
): { tdee: number; targetCalories: number } {
  let multiplier = 1.55; // moderate default

  switch (activityLevel) {
    case "sedentary":
      multiplier = 1.2;
      break;
    case "light":
      multiplier = 1.375;
      break;
    case "moderate":
      multiplier = 1.55;
      break;
    case "very_active":
      multiplier = 1.725;
      break;
    default:
      multiplier = 1.55;
  }

  const tdee = Math.round(bmr * multiplier);
  let targetCalories = tdee;

  const goalLower = goal.toLowerCase();
  if (goalLower.includes("fat loss") || goalLower.includes("lean") || goalLower.includes("cut")) {
    targetCalories = Math.round(tdee - 450); // Moderate deficit
  } else if (goalLower.includes("hypertrophy") || goalLower.includes("muscle") || goalLower.includes("gain") || goalLower.includes("bulk")) {
    targetCalories = Math.round(tdee + 300); // Controlled surplus
  }

  return { tdee, targetCalories };
}

export function calculateMacros(
  targetCalories: number,
  weightKg: number,
  goal: string = "Hypertrophy"
): MacroBreakdown {
  const isFatLoss =
    goal.toLowerCase().includes("fat loss") ||
    goal.toLowerCase().includes("lean") ||
    goal.toLowerCase().includes("cut");
  const proteinPerKg = isFatLoss ? 2.2 : 2.0;
  const proteinGrams = Math.round(weightKg * proteinPerKg);
  const proteinCalories = proteinGrams * 4;

  // Fats: ~25% of target calories
  const fatsCalories = Math.round(targetCalories * 0.25);
  const fatsGrams = Math.round(fatsCalories / 9);

  // Carbs: remainder
  const remainingCalories = Math.max(targetCalories - proteinCalories - fatsCalories, 400);
  const carbsCalories = remainingCalories;
  const carbsGrams = Math.round(carbsCalories / 4);

  return {
    proteinGrams,
    carbsGrams,
    fatsGrams,
    proteinCalories,
    carbsCalories,
    fatsCalories,
  };
}

export function getFullMetabolicProfile(
  weightKg: number = 70,
  heightCm: number = 175,
  age: number = 26,
  gender: string = "male",
  activityLevel: string = "moderate",
  goal: string = "Hypertrophy"
): MetabolicProfile {
  const bmi = calculateBMI(weightKg, heightCm);
  const bmr = calculateBMR(weightKg, heightCm, age, gender);
  const { tdee, targetCalories } = calculateTDEE(bmr, activityLevel, goal);
  const macros = calculateMacros(targetCalories, weightKg, goal);

  return {
    bmi,
    bmr,
    tdee,
    targetCalories,
    macros,
  };
}
