import compression from "compression";
import cors from "cors";
import express from "express";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import config from "./config/config";
import { connectDB } from "./config/database";
import { errorHandler } from "./middleware/errorHandler";
import { logger } from "./utils/logger";

// Import routes
import adminRoutes from "./routes/admin.routes";
import authRoutes from "./routes/auth.routes";
import authorRoutes from "./routes/author.routes";
import bookRoutes from "./routes/book.routes";
import borrowRoutes from "./routes/borrow.routes";
import categoryRoutes from "./routes/category.routes";
import commentRoutes from "./routes/comment.routes";
import publisherRoutes from "./routes/publisher.routes";
import reactionRoutes from "./routes/reaction.routes";
import userRoutes from "./routes/user.routes";
import seedDatabase from "./scripts/seedBooks";

const app = express();

// Connect to MongoDB
connectDB();

// Security Middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
  origin: [
    config.FRONTEND_URL,
    config.ADMIN_FRONTEND_URL,
    "http://localhost:3000",
    "http://localhost:3001",
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"],
};

app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX_REQUESTS,
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/", limiter);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
// app.use(xss());

// Prevent parameter pollution
app.use(hpp());

// Compression middleware
app.use(compression());

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path} - ${req.ip}`);
  next();
});

// Health check endpoint
app.get("/health", (req, res) => {
  seedDatabase();
  res.status(200).json({
    status: "success",
    message: "IRO Library Management System API is running",
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/publishers", publisherRoutes);
app.use("/api/authors", authorRoutes);
app.use("/api/borrows", borrowRoutes);
app.use("/api/reactions", reactionRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/admin", adminRoutes);

// 404 handler
app.all("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use(errorHandler);

// For Vercel serverless deployment
if (process.env.NODE_ENV !== "production") {
  const PORT = config.PORT || 5000;
  const server = app.listen(PORT, () => {
    logger.info(`Server running in ${config.NODE_ENV} mode on port ${PORT}`);
  });

  // Handle unhandled promise rejections
  process.on("unhandledRejection", (err: Error) => {
    logger.error("Unhandled Promise Rejection:", err);
    server.close(() => {
      process.exit(1);
    });
  });

  // Handle uncaught exceptions
  process.on("uncaughtException", (err: Error) => {
    logger.error("Uncaught Exception:", err);
    process.exit(1);
  });
}

export default app;
