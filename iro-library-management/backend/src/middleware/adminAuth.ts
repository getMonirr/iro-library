import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "./auth";

export const adminAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({
      status: "error",
      message: "You are not logged in!",
    });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({
      status: "error",
      message:
        "You do not have permission to perform this action. Admin access required.",
    });
  }

  return next();
};
