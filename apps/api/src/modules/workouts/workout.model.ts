import mongoose, { Schema, Document } from "mongoose";

export interface IExercise {
  name: string;
  targetMuscle: string;
  equipment: string;
  sets: number;
  reps: string;
  restSeconds: number;
  instructions: string[];
  formCues: string[];
  thumbnail?: string;
}

export interface IWorkout extends Document {
  customId?: string;
  title: string;
  category: "strength" | "hiit" | "cardio" | "mobility" | "power";
  targetGoal?: "hypertrophy" | "fat_loss" | "endurance" | "strength";
  duration: number; // in minutes
  calories: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  equipment?: "bodyweight" | "dumbbell" | "barbell" | "cables" | "kettlebell";
  bodyPart?: "full_body" | "chest" | "back" | "legs" | "core" | "arms";
  exercisesCount: number;
  thumbnail: string;
  videoUrl?: string;
  description?: string;
  exercises: IExercise[];
  createdAt: Date;
  updatedAt: Date;
}

const ExerciseSchema = new Schema<IExercise>(
  {
    name: { type: String, required: true },
    targetMuscle: { type: String, required: true },
    equipment: { type: String, default: "bodyweight" },
    sets: { type: Number, required: true, min: 1 },
    reps: { type: String, required: true },
    restSeconds: { type: Number, default: 60 },
    instructions: [{ type: String }],
    formCues: [{ type: String }],
    thumbnail: { type: String, default: "" },
  },
  {
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, any>) => {
        ret.id = ret._id?.toString() || ret.id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

const WorkoutSchema = new Schema<IWorkout>(
  {
    customId: {
      type: String,
      index: true,
      sparse: true,
    },
    title: {
      type: String,
      required: [true, "Workout title is required"],
      trim: true,
    },
    category: {
      type: String,
      enum: ["strength", "hiit", "cardio", "mobility", "power"],
      required: true,
    },
    targetGoal: {
      type: String,
      enum: ["hypertrophy", "fat_loss", "endurance", "strength"],
    },
    duration: {
      type: Number,
      required: true,
      min: 1,
    },
    calories: {
      type: Number,
      required: true,
      min: 0,
    },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    equipment: {
      type: String,
      enum: ["bodyweight", "dumbbell", "barbell", "cables", "kettlebell"],
    },
    bodyPart: {
      type: String,
      enum: ["full_body", "chest", "back", "legs", "core", "arms"],
    },
    exercisesCount: {
      type: Number,
      default: 0,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
    exercises: [ExerciseSchema],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, any>) => {
        ret.id = ret.customId || ret._id?.toString() || ret.id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (_doc, ret: Record<string, any>) => {
        ret.id = ret.customId || ret._id?.toString() || ret.id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

WorkoutSchema.pre("save", function (next) {
  if (this.exercises) {
    this.exercisesCount = this.exercises.length;
  }
  next();
});

export const Workout = mongoose.model<IWorkout>("Workout", WorkoutSchema);
