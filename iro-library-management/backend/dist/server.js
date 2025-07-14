"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const express_mongo_sanitize_1 = __importDefault(require("express-mongo-sanitize"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const hpp_1 = __importDefault(require("hpp"));
const xss_clean_1 = __importDefault(require("xss-clean"));
const config_1 = __importDefault(require("./config/config"));
const database_1 = require("./config/database");
const errorHandler_1 = require("./middleware/errorHandler");
const logger_1 = require("./utils/logger");
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const book_routes_1 = __importDefault(require("./routes/book.routes"));
const borrow_routes_1 = __importDefault(require("./routes/borrow.routes"));
const comment_routes_1 = __importDefault(require("./routes/comment.routes"));
const reaction_routes_1 = __importDefault(require("./routes/reaction.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const app = (0, express_1.default)();
(0, database_1.connectDB)();
app.use((0, helmet_1.default)());
const corsOptions = {
    origin: [
        config_1.default.FRONTEND_URL,
        config_1.default.ADMIN_FRONTEND_URL,
        "http://localhost:3000",
        "http://localhost:3001",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"],
};
app.use((0, cors_1.default)(corsOptions));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: config_1.default.RATE_LIMIT_WINDOW_MS,
    max: config_1.default.RATE_LIMIT_MAX_REQUESTS,
    message: "Too many requests from this IP, please try again later.",
    standardHeaders: true,
    legacyHeaders: false,
});
app.use("/api/", limiter);
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
app.use((0, express_mongo_sanitize_1.default)());
app.use((0, xss_clean_1.default)());
app.use((0, hpp_1.default)());
app.use((0, compression_1.default)());
app.use((req, res, next) => {
    logger_1.logger.info(`${req.method} ${req.path} - ${req.ip}`);
    next();
});
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "IRO Library Management System API is running",
        timestamp: new Date().toISOString(),
        environment: config_1.default.NODE_ENV,
    });
});
app.use("/api/auth", auth_routes_1.default);
app.use("/api/users", user_routes_1.default);
app.use("/api/books", book_routes_1.default);
app.use("/api/borrows", borrow_routes_1.default);
app.use("/api/reactions", reaction_routes_1.default);
app.use("/api/comments", comment_routes_1.default);
app.use("/api/admin", admin_routes_1.default);
app.all("*", (req, res) => {
    res.status(404).json({
        status: "error",
        message: `Route ${req.originalUrl} not found`,
    });
});
app.use(errorHandler_1.errorHandler);
const PORT = config_1.default.PORT || 5000;
const server = app.listen(PORT, () => {
    logger_1.logger.info(`Server running in ${config_1.default.NODE_ENV} mode on port ${PORT}`);
});
process.on("unhandledRejection", (err) => {
    logger_1.logger.error("Unhandled Promise Rejection:", err);
    server.close(() => {
        process.exit(1);
    });
});
process.on("uncaughtException", (err) => {
    logger_1.logger.error("Uncaught Exception:", err);
    process.exit(1);
});
exports.default = app;
//# sourceMappingURL=server.js.map