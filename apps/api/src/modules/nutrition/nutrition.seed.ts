export interface SeedMealItem {
  id: string;
  title: string;
  category: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: string[];
}

export const initialSeedMeals: SeedMealItem[] = [
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
