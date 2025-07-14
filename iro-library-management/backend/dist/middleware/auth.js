"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optionalAuth = exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
const User_1 = __importDefault(require("../models/User"));
const errorHandler_1 = require("./errorHandler");
exports.authenticate = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
    let token;
    if (req.headers.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
        return res.status(401).json({
            status: "error",
            message: "You are not logged in! Please log in to get access.",
        });
    }
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.JWT_SECRET);
    const currentUser = await User_1.default.findById(decoded.id).select("+password");
    if (!currentUser) {
        return res.status(401).json({
            status: "error",
            message: "The user belonging to this token does no longer exist.",
        });
    }
    if (!currentUser.isActive) {
        return res.status(401).json({
            status: "error",
            message: "Your account has been deactivated. Please contact support.",
        });
    }
    if (currentUser.isLocked) {
        return res.status(401).json({
            status: "error",
            message: "Your account is temporarily locked due to too many failed login attempts.",
        });
    }
    req.user = currentUser;
    next();
});
const authorize = (...roles) => {
    return (req, res, next) => {
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
        next();
    };
};
exports.authorize = authorize;
exports.optionalAuth = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
    let token;
    if (req.headers.authorization?.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }
    if (token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, config_1.default.JWT_SECRET);
            const currentUser = await User_1.default.findById(decoded.id);
            if (currentUser && currentUser.isActive && !currentUser.isLocked) {
                req.user = currentUser;
            }
        }
        catch (error) {
        }
    }
    next();
});
//# sourceMappingURL=auth.js.map