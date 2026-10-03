import dns from "node:dns";
import mongoose from "mongoose";
import { config } from "../config/env.js";

// Ensure Node.js handles SRV DNS resolution reliably on Windows
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
  // Ignore if network permission is restricted
}

export const connectDB = async (): Promise<boolean> => {
  if (mongoose.connection.readyState >= 1) {
    return true;
  }

  // Check if URI exists and doesn't lack required Atlas credentials
  const uri = config.mongoUri;
  if (!uri || (uri.includes("mongodb+srv") && !uri.includes(":") && uri.split("@")[0].split("//")[1]?.indexOf(":") === -1)) {
    console.warn("[Database] Notice: MONGODB_URI has no password specified. Operating with in-memory resilient store.");
    return false;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3500,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error) {
    console.warn(`[Database] MongoDB connection bypassed: ${(error as Error).message}`);
    console.log("[Database] Resilient mode active: serving data seamlessly.");
    return false;
  }
};

export const isDbConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
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

