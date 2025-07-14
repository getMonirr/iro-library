import { NextFunction, Request, Response } from "express";
interface CustomError extends Error {
    statusCode?: number;
    code?: number;
    path?: string;
    value?: any;
    keyValue?: any;
    errors?: any;
}
export declare const errorHandler: (err: CustomError, req: Request, res: Response, next: NextFunction) => void;
export declare const catchAsync: (fn: Function) => (req: Request, res: Response, next: NextFunction) => void;
export {};
//# sourceMappingURL=errorHandler.d.ts.map