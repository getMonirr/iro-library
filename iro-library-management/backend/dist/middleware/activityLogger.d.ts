import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "./auth";
interface LogActivityOptions {
    action: string;
    resource: string;
    resourceId?: string;
    details?: Record<string, any>;
    severity?: "low" | "medium" | "high" | "critical";
    category: "auth" | "user_management" | "book_management" | "borrowing" | "system" | "security";
}
export declare const logActivity: (req: AuthenticatedRequest, options: LogActivityOptions) => Promise<void>;
export declare const createActivityLogger: (options: LogActivityOptions) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
declare const _default: {
    logActivity: (req: AuthenticatedRequest, options: LogActivityOptions) => Promise<void>;
    createActivityLogger: (options: LogActivityOptions) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
};
export default _default;
//# sourceMappingURL=activityLogger.d.ts.map