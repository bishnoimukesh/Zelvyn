import mongoose, { Schema, Document } from "mongoose";

export interface IWorkoutLog extends Document {
  userId: mongoose.Types.ObjectId;
  workoutId?: mongoose.Types.ObjectId;
  workoutTitle: string;
  category: "strength" | "hiit" | "cardio" | "mobility" | "power";
  date: Date;
  durationMinutes: number;
  totalVolumeKg: number;
  caloriesBurned: number;
  setsCompleted: number;
  totalSets: number;
  createdAt: Date;
  updatedAt: Date;
}

const WorkoutLogSchema = new Schema<IWorkoutLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    workoutId: {
      type: Schema.Types.ObjectId,
      ref: "Workout",
    },
    workoutTitle: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["strength", "hiit", "cardio", "mobility", "power"],
      default: "strength",
    },
    date: {
      type: Date,
      default: Date.now,
      index: true,
    },
    durationMinutes: {
      type: Number,
      required: true,
      min: 1,
    },
    totalVolumeKg: {
      type: Number,
      default: 0,
    },
    caloriesBurned: {
      type: Number,
      default: 0,
    },
    setsCompleted: {
      type: Number,
      default: 0,
    },
    totalSets: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const WorkoutLog = mongoose.model<IWorkoutLog>("WorkoutLog", WorkoutLogSchema);
