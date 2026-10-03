import mongoose, { Schema, Document } from "mongoose";
import { type SeedVideoChapter } from "./video.seed.js";

export interface IVideoDocument extends Document {
  customId: string;
  title: string;
  trainer: {
    name: string;
    role: string;
    avatar: string;
  };
  category: "hiit" | "strength" | "mobility" | "yoga" | "cardio" | "core";
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: number;
  calories: number;
  thumbnail: string;
  videoUrl: string;
  equipment: string;
  viewsCount: string;
  rating: number;
  isFeatured: boolean;
  chapters: SeedVideoChapter[];
  bookmarkedBy: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ChapterSchema = new Schema<SeedVideoChapter>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    timeFormatted: { type: String, required: true },
    timestampSeconds: { type: Number, required: true },
    durationSeconds: { type: Number, required: true },
    targetReps: { type: Number },
    formCue: { type: String, default: "" },
  },
  { _id: false }
);

const VideoSchema = new Schema<IVideoDocument>(
  {
    customId: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    trainer: {
      name: { type: String, required: true },
      role: { type: String, required: true },
      avatar: { type: String, required: true },
    },
    category: {
      type: String,
      enum: ["hiit", "strength", "mobility", "yoga", "cardio", "core"],
      required: true,
      index: true,
    },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    duration: { type: Number, required: true },
    calories: { type: Number, required: true },
    thumbnail: { type: String, required: true },
    videoUrl: { type: String, required: true },
    equipment: { type: String, default: "Bodyweight" },
    viewsCount: { type: String, default: "1.0k" },
    rating: { type: Number, default: 4.8 },
    isFeatured: { type: Boolean, default: false },
    chapters: { type: [ChapterSchema], default: [] },
    bookmarkedBy: { type: [String], default: [] },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, any>) {
        ret.id = ret.customId || (ret._id ? ret._id.toString() : ret.id);
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      transform(_doc, ret: Record<string, any>) {
        ret.id = ret.customId || (ret._id ? ret._id.toString() : ret.id);
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Video = mongoose.model<IVideoDocument>("Video", VideoSchema);
