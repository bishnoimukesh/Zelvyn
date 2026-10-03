import mongoose, { Schema, Document } from 'mongoose';
import { SeedAchievement } from './achievements.seed.js';

export interface IGamificationDocument extends Document {
  userId: string;
  level: number;
  title: string;
  currentXp: number;
  nextLevelXp: number;
  achievements: SeedAchievement[];
  createdAt: Date;
  updatedAt: Date;
}

const AchievementSubSchema = new Schema<SeedAchievement>(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    xp: { type: Number, required: true, default: 50 },
    unlocked: { type: Boolean, required: true, default: false },
    unlockedDate: { type: String },
    iconKey: { type: String, required: true, default: 'Trophy' },
    color: { type: String, required: true, default: '#C8FF47' },
    category: { type: String, required: true, default: 'workout' },
  },
  { _id: false }
);

const GamificationSchema = new Schema<IGamificationDocument>(
  {
    userId: { type: String, required: true, unique: true },
    level: { type: Number, required: true, default: 1 },
    title: { type: String, required: true, default: 'Beginner Athlete' },
    currentXp: { type: Number, required: true, default: 0 },
    nextLevelXp: { type: Number, required: true, default: 200 },
    achievements: [AchievementSubSchema],
  },
  {
    timestamps: true,
  }
);

export const GamificationModel = mongoose.model<IGamificationDocument>(
  'Gamification',
  GamificationSchema
);
