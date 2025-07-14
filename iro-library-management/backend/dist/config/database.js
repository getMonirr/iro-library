"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const logger_1 = require("../utils/logger");
const config_1 = __importDefault(require("./config"));
const connectDB = async () => {
    try {
        const mongoURI = config_1.default.NODE_ENV === "test" ? config_1.default.MONGODB_TEST_URI : config_1.default.MONGODB_URI;
        const conn = await mongoose_1.default.connect(mongoURI, {});
        logger_1.logger.info(`MongoDB Connected: ${conn.connection.host}`);
        mongoose_1.default.connection.on("error", (err) => {
            logger_1.logger.error("MongoDB connection error:", err);
        });
        mongoose_1.default.connection.on("disconnected", () => {
            logger_1.logger.warn("MongoDB disconnected");
        });
        process.on("SIGINT", async () => {
            try {
                await mongoose_1.default.connection.close();
                logger_1.logger.info("MongoDB connection closed through app termination");
                process.exit(0);
            }
            catch (err) {
                logger_1.logger.error("Error closing MongoDB connection:", err);
                process.exit(1);
            }
        });
    }
    catch (error) {
        logger_1.logger.error("MongoDB connection failed:", error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=database.js.map