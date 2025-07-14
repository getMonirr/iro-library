import mongoose from "mongoose";
import { logger } from "../utils/logger";
import config from "./config";

export const connectDB = async (): Promise<void> => {
  try {
    const mongoURI =
      config.NODE_ENV === "test" ? config.MONGODB_TEST_URI : config.MONGODB_URI;

    const conn = await mongoose.connect(mongoURI, {
      // Remove deprecated options
    });

    logger.info(`MongoDB Connected: ${conn.connection.host}`);

    // Handle connection events
    mongoose.connection.on("error", (err) => {
      logger.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected");
    });

    // Graceful shutdown
    process.on("SIGINT", async () => {
      try {
        await mongoose.connection.close();
        logger.info("MongoDB connection closed through app termination");
        process.exit(0);
      } catch (err) {
        logger.error("Error closing MongoDB connection:", err);
        process.exit(1);
      }
    });
  } catch (error) {
    logger.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};
