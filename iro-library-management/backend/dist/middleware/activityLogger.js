"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createActivityLogger = exports.logActivity = void 0;
const ActivityLog_1 = __importDefault(require("../models/ActivityLog"));
const logActivity = async (req, options) => {
    try {
        if (!req.user)
            return;
        await ActivityLog_1.default.create({
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
    }
    catch (error) {
        console.error("Failed to log activity:", error);
    }
};
exports.logActivity = logActivity;
const createActivityLogger = (options) => {
    return async (req, res, next) => {
        const originalJson = res.json;
        res.json = function (body) {
            if (res.statusCode >= 200 && res.statusCode < 400) {
                (0, exports.logActivity)(req, {
                    ...options,
                    details: {
                        ...options.details,
                        method: req.method,
                        url: req.originalUrl,
                        statusCode: res.statusCode,
                    },
                });
            }
            return originalJson.call(this, body);
        };
        next();
    };
};
exports.createActivityLogger = createActivityLogger;
exports.default = { logActivity: exports.logActivity, createActivityLogger: exports.createActivityLogger };
//# sourceMappingURL=activityLogger.js.map