import mongoose from "mongoose";
import dns from "node:dns";
import { config } from "../config/env.js";
import { Workout } from "../modules/workouts/workout.model.js";
import { initialSeedWorkouts } from "../modules/workouts/workout.seed.js";

// Ensure Node handles SRV DNS resolution on Windows
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch {
  // Ignore
}

async function runSeed() {
  console.log("==========================================");
  console.log("   FitSync Database Seeder Utility        ");
  console.log("==========================================");

  const uri = config.mongoUri;
  console.log(`[Seeder] Target Mongo URI: ${uri.replace(/\/\/[^:]+:[^@]+@/, "//***:***@")}`);

  if (!uri || (uri.includes("mongodb+srv") && !uri.includes(":"))) {
    console.error("[Seeder] Error: MongoDB URI is missing password credentials.");
    console.error("[Seeder] Please update MONGODB_URI in apps/api/.env with your MongoDB password:");
    console.error("         Example: mongodb+srv://mukeshbishnoi_db_user:<YOUR_PASSWORD>@zelvyn.xvix1ps.mongodb.net/fitsync?retryWrites=true&w=majority");
    process.exit(1);
  }

  try {
    console.log("[Seeder] Connecting to MongoDB...");
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Seeder] Connected to database: ${mongoose.connection.name}`);

    console.log("[Seeder] Clearing existing workouts collection...");
    const deleteResult = await Workout.deleteMany({});
    console.log(`[Seeder] Cleared ${deleteResult.deletedCount} old documents.`);

    console.log(`[Seeder] Inserting ${initialSeedWorkouts.length} rich workout routines...`);
    const inserted = await Workout.insertMany(initialSeedWorkouts);

    console.log(`[Seeder] Successfully inserted ${inserted.length} workouts into MongoDB!`);
    inserted.forEach((w, index) => {
      console.log(`  ${index + 1}. [${w.category.toUpperCase()}] ${w.title} (${w.duration} min, ${w.difficulty})`);
    });

    console.log("==========================================");
    console.log(" Seeding completed successfully! ");
    console.log("==========================================");
    process.exit(0);
  } catch (error) {
    console.error("[Seeder] Error seeding database:", (error as Error).message);
    process.exit(1);
  }
}

runSeed();
