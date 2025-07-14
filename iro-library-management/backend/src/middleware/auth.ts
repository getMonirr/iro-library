import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config";
import User, { IUser } from "../models/User";
import { catchAsync } from "./errorHandler";

export interface AuthenticatedRequest extends Request {
  user?: IUser;
}

export const authenticate = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // 1) Getting token and check if it's there
    let token: string | undefined;

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "You are not logged in! Please log in to get access.",
      });
    }

    // 2) Verification token
    const decoded = jwt.verify(token, config.JWT_SECRET) as {
      id: string;
      iat: number;
    };

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id).select("+password");
    if (!currentUser) {
      return res.status(401).json({
        status: "error",
        message: "The user belonging to this token does no longer exist.",
      });
    }

    // 4) Check if user is active
    if (!currentUser.isActive) {
      return res.status(401).json({
        status: "error",
        message: "Your account has been deactivated. Please contact support.",
      });
    }

    // 5) Check if account is locked
    if (currentUser.isLocked) {
      return res.status(401).json({
        status: "error",
        message:
          "Your account is temporarily locked due to too many failed login attempts.",
      });
    }

    // 6) Grant access to protected route
    req.user = currentUser;
    return next();
  }
);

export const authorize = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        status: "error",
        message: "You are not logged in!",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "error",
        message: "You do not have permission to perform this action",
      });
    }

    return next();
  };
};

export const optionalAuth = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    let token: string | undefined;

    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, config.JWT_SECRET) as {
          id: string;
          iat: number;
        };
        const currentUser = await User.findById(decoded.id);

        if (currentUser && currentUser.isActive && !currentUser.isLocked) {
          req.user = currentUser;
        }
      } catch (error) {
        // Invalid token, but continue without authentication
      }
    }

    return next();
  }
);
