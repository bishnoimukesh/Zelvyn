import mongoose, { Schema, Document } from "mongoose";
import {
  initialWeightLogs,
  initialStepDistribution,
  initialBadges,
  type SeedWeightLog,
  type SeedDayStep,
  type SeedStreakBadge,
} from "./progress.seed.js";

export interface IProgressDocument extends Document {
  userId: string;
  weightStarting: number;
  weightTarget: number;
  weightHistory: SeedWeightLog[];
  stepTracker: {
    todaySteps: number;
    goalSteps: number;
    weeklyDistribution: SeedDayStep[];
  };
  streak: {
    current: number;
    longest: number;
    badges: SeedStreakBadge[];
  };
  calorieTarget: number;
  createdAt: Date;
  updatedAt: Date;
}

const WeightLogSchema = new Schema<SeedWeightLog>(
  {
    id: { type: String, required: true },
    date: { type: String, required: true },
    weight: { type: Number, required: true },
    bodyFatPercent: { type: Number },
    notes: { type: String },
  },
  { _id: false }
);

const DayStepSchema = new Schema<SeedDayStep>(
  {
    day: { type: String, required: true },
    date: { type: String, required: true },
    steps: { type: Number, required: true },
    goal: { type: Number, required: true },
  },
  { _id: false }
);

const BadgeSchema = new Schema<SeedStreakBadge>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    icon: { type: String, required: true },
    description: { type: String, required: true },
    unlocked: { type: Boolean, default: false },
  },
  { _id: false }
);

const ProgressSchema = new Schema<IProgressDocument>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    weightStarting: { type: Number, default: 73.5 },
    weightTarget: { type: Number, default: 68.0 },
    weightHistory: { type: [WeightLogSchema], default: initialWeightLogs },
    stepTracker: {
      todaySteps: { type: Number, default: 10680 },
      goalSteps: { type: Number, default: 10000 },
      weeklyDistribution: { type: [DayStepSchema], default: initialStepDistribution },
    },
    streak: {
      current: { type: Number, default: 7 },
      longest: { type: Number, default: 14 },
      badges: { type: [BadgeSchema], default: initialBadges },
    },
    calorieTarget: { type: Number, default: 600 },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, any>) {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform(_doc, ret: Record<string, any>) {
        ret.id = ret._id ? ret._id.toString() : ret.id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Progress = mongoose.model<IProgressDocument>("Progress", ProgressSchema);
