import app from "./app.js";
import { connectDB } from "./database/db.js";
import { config } from "./config/env.js";

const startServer = async (): Promise<void> => {
  // Connect Database
  await connectDB();

  // Start HTTP Server
  const server = app.listen(config.port, () => {
    console.log(`[Server] FitSync API running on http://localhost:${config.port}`);
    console.log(`[Server] Environment: ${config.nodeEnv}`);
    console.log(`[Server] Health Check: http://localhost:${config.port}/api/health`);
  });

  // Graceful Shutdown
  const shutdown = (): void => {
    console.log("\n[Server] Shutting down gracefully...");
    server.close(() => {
      console.log("[Server] HTTP server closed.");
      process.exit(0);
    });
  };

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
};

startServer().catch((err) => {
  console.error("[Server] Fatal error on startup:", err);
  process.exit(1);
});
