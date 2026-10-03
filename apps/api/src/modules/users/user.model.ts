import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  customId?: string;
  name: string;
  email: string;
  avatarUrl?: string;
  fitnessLevel: "beginner" | "intermediate" | "advanced";
  height?: number; // in cm
  weight?: number; // in kg
  targetWeight?: number; // in kg
  age?: number;
  gender?: "male" | "female" | "other";
  activityLevel?: "sedentary" | "light" | "moderate" | "very_active";
  goal?: string;
  isOnboarded: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    customId: {
      type: String,
      sparse: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    avatarUrl: {
      type: String,
      default: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
    },
    fitnessLevel: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "intermediate",
    },
    height: {
      type: Number,
      default: 175,
      min: 0,
    },
    weight: {
      type: Number,
      default: 70,
      min: 0,
    },
    targetWeight: {
      type: Number,
      default: 67,
      min: 0,
    },
    age: {
      type: Number,
      default: 26,
      min: 0,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "male",
    },
    activityLevel: {
      type: String,
      enum: ["sedentary", "light", "moderate", "very_active"],
      default: "moderate",
    },
    goal: {
      type: String,
      default: "Hypertrophy & Muscle Gain",
    },
    isOnboarded: {
      type: Boolean,
      default: true,
    },
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

export const User = mongoose.model<IUser>("User", UserSchema);
