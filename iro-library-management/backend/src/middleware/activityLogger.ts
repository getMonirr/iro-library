import { NextFunction, Response } from "express";
import ActivityLog from "../models/ActivityLog";
import { AuthenticatedRequest } from "./auth";

interface LogActivityOptions {
  action: string;
  resource: string;
  resourceId?: string;
  details?: Record<string, any>;
  severity?: "low" | "medium" | "high" | "critical";
  category:
    | "auth"
    | "user_management"
    | "book_management"
    | "borrowing"
    | "system"
    | "security";
}

export const logActivity = async (
  req: AuthenticatedRequest,
  options: LogActivityOptions
): Promise<void> => {
  try {
    if (!req.user) return;

    await ActivityLog.create({
      user: req.user._id,
      action: options.action,
      resource: options.resource,
      resourceId: options.resourceId,
      details: options.details || {},
      ipAddress: req.ip || req.connection?.remoteAddress,
      userAgent: req.get("User-Agent"),
      severity: options.severity || "low",
      category: options.category,
    });
  } catch (error) {
    // Log error but don't break the main flow
    console.error("Failed to log activity:", error);
  }
};

export const createActivityLogger = (options: LogActivityOptions) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    // Store original json function
    const originalJson = res.json;

    // Override json function to log activity on successful response
    res.json = function (body?: any) {
      if (res.statusCode >= 200 && res.statusCode < 400) {
        logActivity(req, {
          ...options,
          details: {
            ...options.details,
            method: req.method,
            url: req.originalUrl,
            statusCode: res.statusCode,
          },
        });
      }

      // Call original json function
      return originalJson.call(this, body);
    };

    next();
  };
};

export default { logActivity, createActivityLogger };
