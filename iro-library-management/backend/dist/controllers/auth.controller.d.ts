import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth";
export declare const signup: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const login: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const logout: (req: Request, res: Response) => void;
export declare const forgotPassword: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const resetPassword: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const updatePassword: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getMe: (req: AuthenticatedRequest, res: Response) => void;
//# sourceMappingURL=auth.controller.d.ts.map