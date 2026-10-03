import mongoose, { Schema, Document } from "mongoose";

export interface ICoachMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  timestamp: string;
  category?: "general" | "workout" | "recovery" | "nutrition";
  generatedWorkout?: Record<string, any>;
  suggestedPrompts?: string[];
}

export interface ICoachDocument extends Document {
  userId: string;
  messages: ICoachMessage[];
  readinessScore: number;
  fatigueLevel: "fresh" | "optimal" | "fatigued" | "overtrained";
  createdAt: Date;
  updatedAt: Date;
}

const CoachMessageSchema = new Schema<ICoachMessage>(
  {
    id: { type: String, required: true },
    sender: { type: String, enum: ["user", "assistant"], required: true },
    text: { type: String, required: true },
    timestamp: { type: String, required: true },
    category: {
      type: String,
      enum: ["general", "workout", "recovery", "nutrition"],
      default: "general",
    },
    generatedWorkout: { type: Schema.Types.Mixed },
    suggestedPrompts: { type: [String], default: [] },
  },
  { _id: false }
);

export const defaultWelcomeMessage: ICoachMessage = {
  id: "m-welcome",
  sender: "assistant",
  text: "Hello Alex! I am your FitSync AI Athletic Coach. I've synced your latest biometrics: **69.9 kg bodyweight**, **7-Day Active Streak**, and **88% Prime Readiness**. I can engineer customized workout routines, diagnose training fatigue, prescribe macro splits, or analyze your progressive overload. What are we targeting today?",
  timestamp: "Just now",
  category: "general",
  suggestedPrompts: [
    "Generate a 25-min HIIT core burner",
    "Alternative exercises for shoulder impingement",
    "Calculate daily protein & calorie targets for 69.9kg",
    "Optimal recovery protocol for sore hamstrings",
  ],
};

const CoachSchema = new Schema<ICoachDocument>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    messages: { type: [CoachMessageSchema], default: [defaultWelcomeMessage] },
    readinessScore: { type: Number, default: 88 },
    fatigueLevel: {
      type: String,
      enum: ["fresh", "optimal", "fatigued", "overtrained"],
      default: "optimal",
    },
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

export const Coach = mongoose.model<ICoachDocument>("Coach", CoachSchema);
