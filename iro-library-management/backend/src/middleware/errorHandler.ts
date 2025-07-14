import { NextFunction, Request, Response } from "express";
import config from "../config/config";
import { logger } from "../utils/logger";

interface CustomError extends Error {
  statusCode?: number;
  code?: number;
  path?: string;
  value?: any;
  keyValue?: any;
  errors?: any;
}

const handleCastErrorDB = (err: CustomError) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return createError(message, 400);
};

const handleDuplicateFieldsDB = (err: CustomError) => {
  const value = err.keyValue ? Object.values(err.keyValue)[0] : "unknown";
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return createError(message, 400);
};

const handleValidationErrorDB = (err: CustomError) => {
  const errors = Object.values(err.errors!).map((el: any) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return createError(message, 400);
};

const handleJWTError = () =>
  createError("Invalid token. Please log in again!", 401);

const handleJWTExpiredError = () =>
  createError("Your token has expired! Please log in again.", 401);

const createError = (message: string, statusCode: number) => {
  const error: CustomError = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const sendErrorDev = (err: CustomError, res: Response) => {
  res.status(err.statusCode || 500).json({
    status: "error",
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: CustomError, res: Response) => {
  // Operational, trusted error: send message to client
  if (err.statusCode && err.statusCode < 500) {
    res.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  } else {
    // Programming or other unknown error: don't leak error details
    logger.error("ERROR 💥", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong!",
    });
  }
};

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;

  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error(`Error ${err.statusCode}: ${err.message}`, {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    stack: err.stack,
  });

  if (config.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else {
    // Handle specific mongoose errors
    if (error.name === "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "ValidationError")
      error = handleValidationErrorDB(error);
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};

export const catchAsync = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
