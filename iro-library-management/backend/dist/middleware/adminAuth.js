"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuth = void 0;
const adminAuth = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            status: "error",
            message: "You are not logged in!",
        });
    }
    if (req.user.role !== "admin") {
        return res.status(403).json({
            status: "error",
            message: "You do not have permission to perform this action. Admin access required.",
        });
    }
    return next();
};
exports.adminAuth = adminAuth;
//# sourceMappingURL=adminAuth.js.map