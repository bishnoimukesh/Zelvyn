import { useState } from "react";
import {
  Sparkles,
  Check,
  ChevronRight,
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";

interface MealItem {
  id: string;
  title: string;
  category: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
}

const INITIAL_MEALS: MealItem[] = [
  {
    id: "m-1",
    title: "High-Protein Breakfast Bowl",
    category: "Breakfast",
    calories: 520,
    protein: 42,
    carbs: 45,
    fat: 14,
    ingredients: [
      "4 egg whites",
      "2 whole eggs",
      "1 cup oats",
      "1 banana",
      "Greek yogurt",
    ],
  },
  {
    id: "m-2",
    title: "Grilled Chicken & Rice",
    category: "Lunch",
    calories: 620,
    protein: 52,
    carbs: 65,
    fat: 12,
    ingredients: [
      "200g chicken breast",
      "1 cup brown rice",
      "Broccoli",
      "Olive oil",
      "Lemon",
    ],
  },
  {
    id: "m-3",
    title: "Salmon & Sweet Potato",
    category: "Dinner",
    calories: 580,
    protein: 44,
    carbs: 48,
    fat: 18,
    ingredients: [
      "200g wild salmon",
      "1 large sweet potato",
      "Asparagus",
      "Garlic butter",
    ],
  },
  {
    id: "m-4",
    title: "Pre-Workout Smoothie",
    category: "Snack",
    calories: 280,
    protein: 26,
    carbs: 38,
    fat: 4,
    ingredients: [
      "1 scoop whey isolate",
      "Almond milk",
      "Blueberries",
      "Chia seeds",
      "Honey",
    ],
  },
  {
    id: "m-5",
    title: "Steak & Roasted Medley",
    category: "Dinner",
    calories: 640,
    protein: 54,
    carbs: 32,
    fat: 22,
    ingredients: [
      "220g flank steak",
      "Bell peppers",
      "Zucchini",
      "Rosemary potatoes",
    ],
  },
  {
    id: "m-6",
    title: "Cottage Cheese Berry Parfait",
    category: "Snack",
    calories: 240,
    protein: 28,
    carbs: 22,
    fat: 3,
    ingredients: [
      "Low-fat cottage cheese",
      "Raspberries",
      "Crushed walnuts",
      "Cinnamon",
    ],
  },
];

export function NutritionPage() {
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [addedMeals, setAddedMeals] = useState<Record<string, boolean>>({});
  const [caloriesConsumed, setCaloriesConsumed] = useState(1180);
  const [proteinConsumed, setProteinConsumed] = useState(112);
  const [carbsConsumed, setCarbsConsumed] = useState(130);
  const [fatConsumed, setFatConsumed] = useState(34);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customMeals, setCustomMeals] = useState<MealItem[]>([]);

  const targetCalories = 1771;
  const remainingCalories = Math.max(0, targetCalories - caloriesConsumed);
  const caloriePercent = Math.min(
    100,
    Math.round((caloriesConsumed / targetCalories) * 100)
  );

  const targetProtein = 164;
  const targetCarbs = 177;
  const targetFat = 49;

  const handleAddMeal = (meal: MealItem) => {
    setAddedMeals((prev) => ({ ...prev, [meal.id]: true }));
    setCaloriesConsumed((prev) => prev + meal.calories);
    setProteinConsumed((prev) => prev + meal.protein);
    setCarbsConsumed((prev) => prev + meal.carbs);
    setFatConsumed((prev) => prev + meal.fat);
  };

  const handleGenerateMeal = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const generated: MealItem = {
        id: `m-ai-${Date.now()}`,
        title: "AI Power Bowl (High-Leucine)",
        category: "Lunch",
        calories: 550,
        protein: 50,
        carbs: 45,
        fat: 12,
        ingredients: [
          "Grilled turkey breast",
          "Quinoa",
          "Steamed edamame",
          "Avocado slices",
          "Lime tahini",
        ],
      };
      setCustomMeals((prev) => [generated, ...prev]);
      setIsGenerating(false);
    }, 800);
  };

  const allMeals = [...customMeals, ...INITIAL_MEALS];
  const filteredMeals =
    selectedFilter === "All"
      ? allMeals
      : allMeals.filter((m) => m.category === selectedFilter);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Breakfast":
        return "bg-[#FF8438]/15 text-[#FF8438] border-[#FF8438]/30";
      case "Lunch":
        return "bg-[#C8FF47]/15 text-[#C8FF47] border-[#C8FF47]/30";
      case "Dinner":
        return "bg-[#A78BFA]/15 text-[#A78BFA] border-[#A78BFA]/30";
      case "Snack":
        return "bg-[#00F0FF]/15 text-[#00F0FF] border-[#00F0FF]/30";
      default:
        return "bg-[#27272A] text-white border-[#3F3F46]";
    }
  };

  return (
    <PageContainer
      title="Nutrition"
      description="Track macros · Plan meals · Optimize performance"
      badge="Macros Active"
    >
      {/* Top Section: Calories Donut & Macros Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Calories Today Card */}
        <div className="rounded-2xl border border-[#1E1E24] bg-[#111114] p-5 flex items-center gap-6 shadow-lg">
          {/* Circular Donut Ring */}
          <div className="relative flex h-32 w-32 shrink-0 items-center justify-center">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-[#1C1C22]"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-[#C8FF47] transition-all duration-700 ease-out"
                strokeWidth="10"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 * (1 - caloriePercent / 100)}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="font-display text-2xl font-black text-white leading-none">
                {caloriesConsumed}
              </span>
              <span className="text-[10px] uppercase font-bold text-[#71717A] mt-0.5">
                kcal
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-center min-w-0">
            <span className="text-xs uppercase font-bold text-[#71717A]">
              Calories Today
            </span>
            <div className="font-display text-3xl font-black text-white mt-0.5">
              {caloriesConsumed}
            </div>
            <div className="text-xs text-[#A1A1AA] mt-0.5">
              of {targetCalories} target
            </div>
            <div className="text-sm font-bold text-[#C8FF47] mt-1.5 flex items-center gap-1">
              <span>{remainingCalories} remaining</span>
            </div>
          </div>
        </div>

        {/* Macros Breakdown Card */}
        <div className="rounded-2xl border border-[#1E1E24] bg-[#111114] p-5 space-y-3.5 shadow-lg flex flex-col justify-center">
          <div className="flex items-center justify-between text-xs font-black uppercase text-white tracking-wider">
            <span>Macros</span>
            <span className="text-[#71717A] font-normal">Daily Targets</span>
          </div>

          {/* Protein */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white font-medium">Protein</span>
              <span className="text-[#A1A1AA] font-mono text-[11px]">
                <strong className="text-white">{proteinConsumed}g</strong> / {targetProtein}g
              </span>
            </div>
            <div className="h-2 w-full bg-[#1C1C22] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#C8FF47] rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(200,255,71,0.5)]"
                style={{
                  width: `${Math.min(100, (proteinConsumed / targetProtein) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Carbs */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white font-medium">Carbs</span>
              <span className="text-[#A1A1AA] font-mono text-[11px]">
                <strong className="text-white">{carbsConsumed}g</strong> / {targetCarbs}g
              </span>
            </div>
            <div className="h-2 w-full bg-[#1C1C22] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#FF8438] rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(255,132,56,0.5)]"
                style={{
                  width: `${Math.min(100, (carbsConsumed / targetCarbs) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Fat */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white font-medium">Fat</span>
              <span className="text-[#A1A1AA] font-mono text-[11px]">
                <strong className="text-white">{fatConsumed}g</strong> / {targetFat}g
              </span>
            </div>
            <div className="h-2 w-full bg-[#1C1C22] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#A78BFA] rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(167,139,250,0.5)]"
                style={{
                  width: `${Math.min(100, (fatConsumed / targetFat) * 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendation Banner */}
      <div className="rounded-2xl border border-[#C8FF47]/20 bg-[#161B12] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-xl bg-[#C8FF47]/15 flex items-center justify-center text-[#C8FF47] shrink-0 border border-[#C8FF47]/30 mt-0.5">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#C8FF47]">
              AI Recommendation
            </h4>
            <p className="text-xs text-[#D4D4D8] mt-0.5 leading-relaxed">
              You&apos;re 52g short on protein. Consider a post-workout shake or add
              chicken to your next meal. Your carbs are on track for today&apos;s
              training.
            </p>
          </div>
        </div>

        <Button
          size="sm"
          onClick={handleGenerateMeal}
          disabled={isGenerating}
          className="gap-2 font-bold text-xs bg-[#C8FF47] text-black hover:bg-[#b5eb38] shrink-0 self-start sm:self-center"
        >
          {isGenerating ? (
            <>Generating...</>
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5" /> Generate Meal
            </>
          )}
        </Button>
      </div>

      {/* Meal Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {["All", "Breakfast", "Lunch", "Dinner", "Snack"].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setSelectedFilter(tab)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
              selectedFilter === tab
                ? "bg-[#C8FF47] text-black shadow-[0_0_12px_rgba(200,255,71,0.25)]"
                : "bg-[#141418] text-[#A1A1AA] hover:text-white hover:bg-[#1A1A22] border border-[#222228]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Meal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMeals.map((meal) => {
          const isAdded = addedMeals[meal.id];

          return (
            <div
              key={meal.id}
              className="rounded-2xl border border-[#1E1E24] bg-[#111114] p-5 flex flex-col justify-between space-y-4 hover:border-[#2E2E38] transition-all shadow-md"
            >
              <div>
                {/* Header: Category Badge + Calories */}
                <div className="flex items-center justify-between">
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-bold border ${getCategoryColor(
                      meal.category
                    )}`}
                  >
                    {meal.category}
                  </span>

                  <div className="text-right">
                    <span className="font-display text-lg font-black text-[#C8FF47]">
                      {meal.calories}
                    </span>{" "}
                    <span className="text-[10px] text-[#71717A] uppercase font-bold">
                      kcal
                    </span>
                  </div>
                </div>

                <h4 className="font-display text-base font-black text-white mt-2">
                  {meal.title}
                </h4>

                {/* Macro breakdown */}
                <div className="flex items-center gap-3 mt-2 text-xs font-mono">
                  <span className="text-[#C8FF47] font-semibold">
                    {meal.protein}g <span className="text-[10px] text-[#71717A]">Protein</span>
                  </span>
                  <span className="text-[#FF8438] font-semibold">
                    {meal.carbs}g <span className="text-[10px] text-[#71717A]">Carbs</span>
                  </span>
                  <span className="text-[#A78BFA] font-semibold">
                    {meal.fat}g <span className="text-[10px] text-[#71717A]">Fat</span>
                  </span>
                </div>

                {/* Ingredients chips */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {meal.ingredients.map((ing, i) => (
                    <span
                      key={i}
                      className="rounded-md bg-[#16161C] border border-[#222228] px-2 py-0.5 text-[10px] text-[#A1A1AA]"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => handleAddMeal(meal)}
                disabled={isAdded}
                className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold border transition-all ${
                  isAdded
                    ? "bg-[#C8FF47]/10 text-[#C8FF47] border-[#C8FF47]/30"
                    : "bg-[#16161A] text-white border-[#222228] hover:border-[#C8FF47] hover:text-[#C8FF47]"
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="h-3.5 w-3.5" /> Added to Today
                  </>
                ) : (
                  <>
                    <span>Add to Today</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </PageContainer>
  );
}
