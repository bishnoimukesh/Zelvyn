import { useState, useEffect } from "react";
import {
  Sparkles,
  Check,
  ChevronRight,
  RefreshCw,
  Plus,
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  fetchNutrition,
  logMealAsync,
  unlogMealAsync,
  addCustomMealAsync,
} from "@/features/nutrition/nutritionSlice";
import { MealItem } from "@/services/api/nutritionService";

export function NutritionPage() {
  const dispatch = useAppDispatch();
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    meals,
    loggedMealIds,
    targetCalories,
    targetProtein,
    targetCarbs,
    targetFat,
    consumedCalories,
    consumedProtein,
    consumedCarbs,
    consumedFat,
    isLiveSynced,
    loading,
  } = useAppSelector((state) => state.nutrition);

  useEffect(() => {
    dispatch(fetchNutrition("demo-user-1"));
  }, [dispatch]);

  const remainingCalories = Math.max(0, targetCalories - consumedCalories);
  const caloriePercent = Math.min(
    100,
    Math.round((consumedCalories / targetCalories) * 100)
  );

  const handleToggleMeal = (meal: MealItem) => {
    const isAdded = loggedMealIds.includes(meal.id);
    if (isAdded) {
      dispatch(unlogMealAsync({ mealId: meal.id }));
    } else {
      dispatch(logMealAsync({ mealId: meal.id }));
    }
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
      dispatch(addCustomMealAsync({ meal: generated }));
      setIsGenerating(false);
    }, 600);
  };

  const filteredMeals =
    selectedFilter === "All"
      ? meals
      : meals.filter((m) => m.category === selectedFilter);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Breakfast":
        return "bg-amber-500/15 text-amber-500 border-amber-500/30";
      case "Lunch":
        return "bg-primary/15 text-primary border-primary/30";
      case "Dinner":
        return "bg-purple-500/15 text-purple-500 border-purple-500/30";
      case "Snack":
        return "bg-cyan-500/15 text-cyan-500 border-cyan-500/30";
      default:
        return "bg-muted text-foreground border-border";
    }
  };

  return (
    <PageContainer
      title="Nutrition"
      description="Track macros · Plan meals · Optimize performance"
      badge={isLiveSynced ? "MongoDB Atlas Synced" : "Macros Active"}
      action={
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => dispatch(fetchNutrition("demo-user-1"))}
            disabled={loading}
            className="gap-1.5 text-xs border-border bg-card text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-primary" : ""}`} />
            Sync
          </Button>
          <Button
            size="sm"
            onClick={handleGenerateMeal}
            disabled={isGenerating}
            className="gap-1.5 font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
          >
            <Sparkles className="h-4 w-4" /> AI Smart Meal
          </Button>
        </div>
      }
    >
      {/* Top Section: Calories Donut & Macros Bars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Calories Today Card */}
        <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-6 shadow-sm">
          {/* Circular Donut Ring */}
          <div className="relative flex h-32 w-32 shrink-0 items-center justify-center">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-muted"
                strokeWidth="10"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-primary transition-all duration-700 ease-out"
                strokeWidth="10"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 * (1 - caloriePercent / 100)}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="font-display text-2xl font-black text-foreground leading-none">
                {consumedCalories}
              </span>
              <span className="text-[10px] uppercase font-bold text-muted-foreground mt-0.5">
                kcal
              </span>
            </div>
          </div>

          <div className="flex flex-col justify-center min-w-0">
            <span className="text-xs uppercase font-bold text-muted-foreground">
              Calories Today
            </span>
            <div className="font-display text-3xl font-black text-foreground mt-0.5">
              {consumedCalories}
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">
              of {targetCalories} target
            </div>
            <div className="text-sm font-bold text-primary mt-1.5 flex items-center gap-1">
              <span>{remainingCalories} remaining</span>
            </div>
          </div>
        </div>

        {/* Macros Breakdown Card */}
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3.5 shadow-sm flex flex-col justify-center">
          <div className="flex items-center justify-between text-xs font-black uppercase text-foreground tracking-wider">
            <span>Macros</span>
            <span className="text-muted-foreground font-normal">Daily Targets</span>
          </div>

          {/* Protein */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-foreground font-medium">Protein</span>
              <span className="text-muted-foreground font-mono text-[11px]">
                <strong className="text-foreground">{consumedProtein}g</strong> / {targetProtein}g
              </span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500 shadow-sm"
                style={{
                  width: `${Math.min(100, (consumedProtein / targetProtein) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Carbs */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-foreground font-medium">Carbs</span>
              <span className="text-muted-foreground font-mono text-[11px]">
                <strong className="text-foreground">{consumedCarbs}g</strong> / {targetCarbs}g
              </span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-500 shadow-sm"
                style={{
                  width: `${Math.min(100, (consumedCarbs / targetCarbs) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Fat */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-foreground font-medium">Fat</span>
              <span className="text-muted-foreground font-mono text-[11px]">
                <strong className="text-foreground">{consumedFat}g</strong> / {targetFat}g
              </span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full transition-all duration-500 shadow-sm"
                style={{
                  width: `${Math.min(100, (consumedFat / targetFat) * 100)}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendation Banner */}
      <div className="rounded-2xl border border-primary/20 bg-primary/10 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-xl bg-primary/15 flex items-center justify-center text-primary shrink-0 border border-primary/30 mt-0.5">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary">
              AI Sports Science Recommendation
            </h4>
            <p className="text-xs text-foreground/90 mt-0.5 leading-relaxed">
              You&apos;re currently tracking toward {targetProtein}g daily protein. Hitting this leucine threshold optimizes Muscle Protein Synthesis (MPS) and spares muscle tissue during high-volume sessions.
            </p>
          </div>
        </div>

        <Button
          size="sm"
          onClick={handleGenerateMeal}
          disabled={isGenerating}
          className="gap-2 font-bold text-xs bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 self-start sm:self-center"
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
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-card text-muted-foreground hover:text-foreground hover:bg-muted border border-border"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Meal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMeals.map((meal) => {
          const isAdded = loggedMealIds.includes(meal.id);

          return (
            <div
              key={meal.id}
              className="rounded-2xl border border-border bg-card p-5 flex flex-col justify-between space-y-4 hover:border-primary/40 transition-all shadow-sm"
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
                    <span className="font-display text-lg font-black text-primary">
                      {meal.calories}
                    </span>{" "}
                    <span className="text-[10px] text-muted-foreground uppercase font-bold">
                      kcal
                    </span>
                  </div>
                </div>

                <h4 className="font-display text-base font-black text-foreground mt-2">
                  {meal.title}
                </h4>

                {/* Macro breakdown */}
                <div className="flex items-center gap-3 mt-2 text-xs font-mono">
                  <span className="text-primary font-semibold">
                    {meal.protein}g <span className="text-[10px] text-muted-foreground">Protein</span>
                  </span>
                  <span className="text-amber-500 font-semibold">
                    {meal.carbs}g <span className="text-[10px] text-muted-foreground">Carbs</span>
                  </span>
                  <span className="text-purple-500 font-semibold">
                    {meal.fat}g <span className="text-[10px] text-muted-foreground">Fat</span>
                  </span>
                </div>

                {/* Ingredients chips */}
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {meal.ingredients.map((ing, i) => (
                    <span
                      key={i}
                      className="rounded-md bg-muted border border-border px-2 py-0.5 text-[10px] text-muted-foreground"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => handleToggleMeal(meal)}
                className={`w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold border transition-all ${
                  isAdded
                    ? "bg-primary/10 text-primary border-primary/30"
                    : "bg-card text-foreground border-border hover:border-primary hover:text-primary"
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="h-3.5 w-3.5" /> Logged Today (Click to Remove)
                  </>
                ) : (
                  <>
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add to Today</span>
                    <ChevronRight className="h-3.5 w-3.5 ml-auto" />
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
