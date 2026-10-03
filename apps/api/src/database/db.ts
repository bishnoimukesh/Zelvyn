import mongoose from "mongoose";
import { config } from "../config/env.js";

export const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error("[Database] Error connecting to MongoDB:", error);
    console.warn("[Database] Tip: Ensure MongoDB is running locally or set MONGODB_URI in apps/api/.env");
  }
};

export const getDbStatus = (): string => {
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  return states[mongoose.connection.readyState] || "unknown";
};

mongoose.connection.on("disconnected", () => {
  console.warn("[Database] MongoDB connection disconnected.");
});

mongoose.connection.on("error", (err) => {
  console.error("[Database] MongoDB connection error:", err);
});
