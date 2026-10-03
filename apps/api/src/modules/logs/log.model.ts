import mongoose, { Schema, Document } from "mongoose";

export interface IWorkoutLog extends Document {
  userId: string;
  workoutId?: string;
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
      type: String,
      required: true,
      index: true,
    },
    workoutId: {
      type: String,
      default: "",
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
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, any>) => {
        ret.id = ret._id?.toString() || ret.id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (_doc, ret: Record<string, any>) => {
        ret.id = ret._id?.toString() || ret.id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const WorkoutLog = mongoose.model<IWorkoutLog>("WorkoutLog", WorkoutLogSchema);
