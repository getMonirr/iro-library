"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: parseInt(process.env.PORT || "5000", 10),
    MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/iro-library",
    MONGODB_TEST_URI: process.env.MONGODB_TEST_URI ||
        "mongodb://localhost:27017/iro-library-test",
    JWT_SECRET: process.env.JWT_SECRET || "your-jwt-secret",
    JWT_EXPIRE: process.env.JWT_EXPIRE || "7d",
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "your-refresh-secret",
    JWT_REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE || "30d",
    EMAIL_HOST: process.env.EMAIL_HOST || "smtp.gmail.com",
    EMAIL_PORT: parseInt(process.env.EMAIL_PORT || "587", 10),
    EMAIL_USER: process.env.EMAIL_USER || "",
    EMAIL_PASS: process.env.EMAIL_PASS || "",
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || "",
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || "",
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || "",
    FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
    ADMIN_FRONTEND_URL: process.env.ADMIN_FRONTEND_URL || "http://localhost:3001",
    RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
    RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10),
    MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE || "10485760", 10),
};
exports.default = config;
//# sourceMappingURL=config.js.map