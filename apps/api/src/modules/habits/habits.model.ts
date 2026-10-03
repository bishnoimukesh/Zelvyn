import mongoose, { Schema, Document } from 'mongoose';

export interface IHabitDocument extends Document {
  userId: string;
  habitId: string;
  name: string;
  current: number;
  target: number;
  unit: string;
  color: string;
  iconKey: string;
  step: number;
  streak: number;
  category: string;
  lastUpdatedDate: string; // YYYY-MM-DD
  history: Array<{
    date: string;
    value: number;
    completed: boolean;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const HabitSchema = new Schema<IHabitDocument>(
  {
    userId: { type: String, required: true, default: 'default_user' },
    habitId: { type: String, required: true },
    name: { type: String, required: true },
    current: { type: Number, required: true, default: 0 },
    target: { type: Number, required: true, default: 1 },
    unit: { type: String, required: true, default: 'units' },
    color: { type: String, required: true, default: '#C8FF47' },
    iconKey: { type: String, required: true, default: 'Sparkles' },
    step: { type: Number, required: true, default: 1 },
    streak: { type: Number, required: true, default: 0 },
    category: { type: String, required: true, default: 'custom' },
    lastUpdatedDate: { type: String, default: () => new Date().toISOString().split('T')[0] },
    history: [
      {
        date: { type: String, required: true },
        value: { type: Number, required: true },
        completed: { type: Boolean, required: true },
      },
    ],
  },
  {
    timestamps: true,
  }
);

HabitSchema.index({ userId: 1, habitId: 1 }, { unique: true });

export const HabitModel = mongoose.model<IHabitDocument>('Habit', HabitSchema);
