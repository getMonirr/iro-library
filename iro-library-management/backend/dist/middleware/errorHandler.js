"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.catchAsync = exports.errorHandler = void 0;
const config_1 = __importDefault(require("../config/config"));
const logger_1 = require("../utils/logger");
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return createError(message, 400);
};
const handleDuplicateFieldsDB = (err) => {
    const value = err.keyValue ? Object.values(err.keyValue)[0] : "unknown";
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return createError(message, 400);
};
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join(". ")}`;
    return createError(message, 400);
};
const handleJWTError = () => createError("Invalid token. Please log in again!", 401);
const handleJWTExpiredError = () => createError("Your token has expired! Please log in again.", 401);
const createError = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};
const sendErrorDev = (err, res) => {
    res.status(err.statusCode || 500).json({
        status: "error",
        error: err,
        message: err.message,
        stack: err.stack,
    });
};
const sendErrorProd = (err, res) => {
    if (err.statusCode && err.statusCode < 500) {
        res.status(err.statusCode).json({
            status: "error",
            message: err.message,
        });
    }
    else {
        logger_1.logger.error("ERROR 💥", err);
        res.status(500).json({
            status: "error",
            message: "Something went wrong!",
        });
    }
};
const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    let error = { ...err };
    error.message = err.message;
    logger_1.logger.error(`Error ${err.statusCode}: ${err.message}`, {
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
        userAgent: req.get("User-Agent"),
        stack: err.stack,
    });
    if (config_1.default.NODE_ENV === "development") {
        sendErrorDev(err, res);
    }
    else {
        if (error.name === "CastError")
            error = handleCastErrorDB(error);
        if (error.code === 11000)
            error = handleDuplicateFieldsDB(error);
        if (error.name === "ValidationError")
            error = handleValidationErrorDB(error);
        if (error.name === "JsonWebTokenError")
            error = handleJWTError();
        if (error.name === "TokenExpiredError")
            error = handleJWTExpiredError();
        sendErrorProd(error, res);
    }
};
exports.errorHandler = errorHandler;
const catchAsync = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    };
};
exports.catchAsync = catchAsync;
//# sourceMappingURL=errorHandler.js.map