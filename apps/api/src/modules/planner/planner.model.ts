import mongoose, { Schema, Document } from "mongoose";
import {
  defaultWeekSchedule,
  generateDefaultMonthDays,
  defaultReminderConfig,
  type SeedDaySchedule,
  type SeedCalendarDayEntry,
  type SeedReminderConfig,
} from "./planner.seed.js";

export interface IPlannerDocument extends Document {
  userId: string;
  schedule: SeedDaySchedule[];
  monthDays: SeedCalendarDayEntry[];
  reminderSettings: SeedReminderConfig;
  createdAt: Date;
  updatedAt: Date;
}

const DayScheduleSchema = new Schema<SeedDaySchedule>(
  {
    day: { type: String, required: true },
    shortDay: { type: String, required: true },
    isRestDay: { type: Boolean, default: false },
    workoutId: { type: String, default: null },
    completed: { type: Boolean, default: false },
    notes: { type: String, default: "" },
  },
  { _id: false }
);

const CalendarDayEntrySchema = new Schema<SeedCalendarDayEntry>(
  {
    dateString: { type: String, required: true },
    dayNumber: { type: Number, required: true },
    dayName: { type: String, required: true },
    isCurrentMonth: { type: Boolean, default: true },
    isToday: { type: Boolean, default: false },
    workoutId: { type: String, default: null },
    completed: { type: Boolean, default: false },
    isRestDay: { type: Boolean, default: false },
    notes: { type: String, default: "" },
  },
  { _id: false }
);

const ReminderConfigSchema = new Schema<SeedReminderConfig>(
  {
    enabled: { type: Boolean, default: true },
    time: { type: String, default: "07:30" },
    leadTimeMinutes: { type: Number, default: 15 },
    notifyRestDays: { type: Boolean, default: true },
    pushPermission: { type: String, default: "default" },
  },
  { _id: false }
);

const PlannerSchema = new Schema<IPlannerDocument>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    schedule: { type: [DayScheduleSchema], default: defaultWeekSchedule },
    monthDays: { type: [CalendarDayEntrySchema], default: generateDefaultMonthDays },
    reminderSettings: { type: ReminderConfigSchema, default: defaultReminderConfig },
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

export const Planner = mongoose.model<IPlannerDocument>("Planner", PlannerSchema);
