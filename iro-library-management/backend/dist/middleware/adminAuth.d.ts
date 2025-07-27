import { NextFunction, Response } from "express";
import { AuthenticatedRequest } from "./auth";
export declare const adminAuth: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
//# sourceMappingURL=adminAuth.d.ts.map