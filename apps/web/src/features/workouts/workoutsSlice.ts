import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Workout } from "@/types";

export interface WorkoutFilters {
  searchQuery: string;
  category: string;
  goal: string;
  equipment: string;
  bodyPart: string;
  difficulty: string;
  duration: string; // "all" | "short" | "medium" | "long"
}

interface WorkoutsState {
  items: Workout[];
  filters: WorkoutFilters;
  loading: boolean;
}

const initialWorkouts: Workout[] = [
  {
    id: "w-1",
    title: "Full Body HIIT Ignition",
    category: "hiit",
    targetGoal: "fat_loss",
    duration: 25,
    calories: 340,
    difficulty: "intermediate",
    equipment: "dumbbell",
    bodyPart: "full_body",
    exercisesCount: 5,
    description: "High-density metabolic conditioning circuit designed to maximize post-exercise oxygen consumption (EPOC).",
    thumbnail: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800",
    exercises: [
      {
        id: "ex-1-1",
        name: "Dumbbell Thrusters",
        targetMuscle: "Full Body & Delts",
        equipment: "Dumbbells",
        sets: 4,
        reps: "12 reps",
        restSeconds: 45,
        instructions: [
          "Hold dumbbells at shoulder height in a neutral rack position.",
          "Squat to parallel with chest proud and knees tracking outward.",
          "Explosively drive through the heels and press weights overhead in one fluid motion.",
        ],
        formCues: ["Keep core braced at bottom", "Lock out elbows overhead", "Inhale on descent"],
        thumbnail: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600",
      },
      {
        id: "ex-1-2",
        name: "Kettlebell Russian Swings",
        targetMuscle: "Posterior Chain & Glutes",
        equipment: "Kettlebell",
        sets: 4,
        reps: "15 reps",
        restSeconds: 45,
        instructions: [
          "Hinge at hips with soft knees, grasping kettlebell with both hands.",
          "Drive hips forward powerfully, snapping glutes to propel bell to eye level.",
          "Control the pendulum arc back through legs without squatting.",
        ],
        formCues: ["Hinge, don't squat", "Glutes locked at peak", "Spine neutral throughout"],
        thumbnail: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&q=80&w=600",
      },
      {
        id: "ex-1-3",
        name: "Renegade Rows & Pushup",
        targetMuscle: "Core & Lats",
        equipment: "Dumbbells",
        sets: 3,
        reps: "10 reps / side",
        restSeconds: 45,
        instructions: [
          "Set up in a tall plank position holding two hex dumbbells.",
          "Perform a strict pushup with chest brushing dumbbells.",
          "Row right dumbbell to hip without rotating hips, repeat on left.",
        ],
        formCues: ["Keep hips square to floor", "Squeeze core to eliminate sway", "Full depth pushup"],
        thumbnail: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=600",
      },
    ],
  },
  {
    id: "w-2",
    title: "Hypertrophy Chest & Back",
    category: "strength",
    targetGoal: "hypertrophy",
    duration: 45,
    calories: 420,
    difficulty: "advanced",
    equipment: "barbell",
    bodyPart: "chest",
    exercisesCount: 4,
    description: "Antagonistic agonist upper body volume split focusing on deep stretch positions and mechanical tension.",
    thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800",
    exercises: [
      {
        id: "ex-2-1",
        name: "Incline Barbell Bench Press",
        targetMuscle: "Clavicular Pectoralis & Triceps",
        equipment: "Barbell",
        sets: 4,
        reps: "8-10 reps",
        restSeconds: 90,
        instructions: [
          "Set incline bench to 30 degrees to bias upper chest fibers.",
          "Retract and depress scapula firmly into the pad.",
          "Lower bar with control to upper chest, then drive up without shrugging shoulders.",
        ],
        formCues: ["Elbows tucked 45-60 degrees", "Touch upper chest lightly", "Maintain leg drive"],
        thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600",
      },
      {
        id: "ex-2-2",
        name: "Bent-Over Barbell Row",
        targetMuscle: "Latissimus Dorsi & Rhomboids",
        equipment: "Barbell",
        sets: 4,
        reps: "8-10 reps",
        restSeconds: 90,
        instructions: [
          "Hinge torso forward to ~45 degrees with knees slightly bent and spine rigid.",
          "Grip barbell slightly wider than shoulder width.",
          "Pull barbell toward lower ribcage, driving elbows past the torso and squeezing scapulae.",
        ],
        formCues: ["Do not use hip bounce", "Pull with elbows, not biceps", "Hold peak contraction 1s"],
        thumbnail: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=600",
      },
      {
        id: "ex-2-3",
        name: "Flat Dumbbell Fly & Press Hybrid",
        targetMuscle: "Sternal Pectoralis",
        equipment: "Dumbbells",
        sets: 3,
        reps: "10-12 reps",
        restSeconds: 60,
        instructions: [
          "Lie flat with dumbbells extended above chest in a neutral grip.",
          "Lower in a wide arc with slight elbow bend until a deep stretch is achieved across pectorals.",
          "Drive back together along the same arc, contracting chest at the apex.",
        ],
        formCues: ["Emphasize the 3-second eccentric stretch", "Do not hyperextend shoulders", "Keep chest expanded"],
        thumbnail: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=600",
      },
      {
        id: "ex-2-4",
        name: "Neutral Grip Lat Pulldown",
        targetMuscle: "Lats & Lower Traps",
        equipment: "Cables",
        sets: 3,
        reps: "10-12 reps",
        restSeconds: 60,
        instructions: [
          "Attach neutral grip handle and sit securely with thigh pads locked.",
          "Lean back slightly (~10 degrees) and pull bar down toward upper sternum.",
          "Slowly release under tension to full overhead lat stretch.",
        ],
        formCues: ["Lead with elbows", "Avoid leaning excessively backwards", "Full stretch at top"],
        thumbnail: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=600",
      },
    ],
  },
  {
    id: "w-3",
    title: "Core Power & Hip Mobility",
    category: "mobility",
    targetGoal: "endurance",
    duration: 20,
    calories: 180,
    difficulty: "beginner",
    equipment: "bodyweight",
    bodyPart: "core",
    exercisesCount: 5,
    description: "Dynamic pelvis alignment, thoracic rotation, and rotational core stability drills for injury resilience.",
    thumbnail: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "w-4",
    title: "Quads & Hamstrings Annihilation",
    category: "strength",
    targetGoal: "hypertrophy",
    duration: 50,
    calories: 480,
    difficulty: "advanced",
    equipment: "barbell",
    bodyPart: "legs",
    exercisesCount: 6,
    description: "Heavy squat compounds followed by Romanian deadlifts and unilateral Bulgarian split squats.",
    thumbnail: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "w-5",
    title: "Tabata Sprint & Calisthenics",
    category: "hiit",
    targetGoal: "fat_loss",
    duration: 18,
    calories: 260,
    difficulty: "beginner",
    equipment: "bodyweight",
    bodyPart: "full_body",
    exercisesCount: 8,
    description: "20s max effort, 10s rest intervals using plyometric pushups, burpees, and mountain climbers.",
    thumbnail: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "w-6",
    title: "Shoulder Boulders & Arms Blast",
    category: "strength",
    targetGoal: "hypertrophy",
    duration: 35,
    calories: 310,
    difficulty: "intermediate",
    equipment: "dumbbell",
    bodyPart: "arms",
    exercisesCount: 7,
    description: "Overhead press pyramid followed by lateral raise giant-sets and supersetted bicep-tricep burnout.",
    thumbnail: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "w-7",
    title: "Kettlebell Ballistic Power",
    category: "power",
    targetGoal: "strength",
    duration: 30,
    calories: 350,
    difficulty: "intermediate",
    equipment: "kettlebell",
    bodyPart: "full_body",
    exercisesCount: 5,
    description: "Explosive kettlebell cleans, snatches, and Turkish get-ups to train triple extension and grip stamina.",
    thumbnail: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "w-8",
    title: "Zone 2 Aerobic Base Builder",
    category: "cardio",
    targetGoal: "endurance",
    duration: 40,
    calories: 360,
    difficulty: "beginner",
    equipment: "bodyweight",
    bodyPart: "full_body",
    exercisesCount: 4,
    description: "Steady-state aerobic base conditioning to boost mitochondrial density and cardiovascular recovery.",
    thumbnail: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "w-9",
    title: "Cable Crossover & Fly Sculpt",
    category: "strength",
    targetGoal: "hypertrophy",
    duration: 30,
    calories: 270,
    difficulty: "intermediate",
    equipment: "cables",
    bodyPart: "chest",
    exercisesCount: 5,
    description: "Continuous tension cable fly angles targeting clavicular, sternal, and abdominal pectoral fibers.",
    thumbnail: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=800",
  },
];

const initialFilters: WorkoutFilters = {
  searchQuery: "",
  category: "all",
  goal: "all",
  equipment: "all",
  bodyPart: "all",
  difficulty: "all",
  duration: "all",
};

const initialState: WorkoutsState = {
  items: initialWorkouts,
  filters: initialFilters,
  loading: false,
};

export const workoutsSlice = createSlice({
  name: "workouts",
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.filters.searchQuery = action.payload;
    },
    setCategoryFilter: (state, action: PayloadAction<string>) => {
      state.filters.category = action.payload;
    },
    setGoalFilter: (state, action: PayloadAction<string>) => {
      state.filters.goal = action.payload;
    },
    setEquipmentFilter: (state, action: PayloadAction<string>) => {
      state.filters.equipment = action.payload;
    },
    setBodyPartFilter: (state, action: PayloadAction<string>) => {
      state.filters.bodyPart = action.payload;
    },
    setDifficultyFilter: (state, action: PayloadAction<string>) => {
      state.filters.difficulty = action.payload;
    },
    setDurationFilter: (state, action: PayloadAction<string>) => {
      state.filters.duration = action.payload;
    },
    addWorkout: (state, action: PayloadAction<Workout>) => {
      const exists = state.items.some((w) => w.id === action.payload.id);
      if (!exists) {
        state.items.unshift(action.payload);
      }
    },
    resetFilters: (state) => {
      state.filters = initialFilters;
    },
  },
});

export const {
  addWorkout,
  setSearchQuery,
  setCategoryFilter,
  setGoalFilter,
  setEquipmentFilter,
  setBodyPartFilter,
  setDifficultyFilter,
  setDurationFilter,
  resetFilters,
} = workoutsSlice.actions;

export default workoutsSlice.reducer;
