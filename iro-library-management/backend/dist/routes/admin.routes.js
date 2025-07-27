"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
const activityLogger_1 = require("../middleware/activityLogger");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.authenticate);
router.patch("/change-first-login-password", (0, activityLogger_1.createActivityLogger)({
    action: "CHANGE_FIRST_LOGIN_PASSWORD",
    resource: "User",
    category: "auth",
    severity: "medium",
}), adminController_1.changeFirstLoginPassword);
router.use((0, auth_1.authorize)("super_admin"));
router.post("/create", (0, activityLogger_1.createActivityLogger)({
    action: "CREATE_ADMIN",
    resource: "User",
    category: "user_management",
    severity: "high",
}), adminController_1.createAdmin);
router.get("/admins", adminController_1.getAllAdmins);
router.patch("/:adminId/toggle-status", (0, activityLogger_1.createActivityLogger)({
    action: "TOGGLE_ADMIN_STATUS",
    resource: "User",
    category: "user_management",
    severity: "high",
}), adminController_1.toggleAdminStatus);
router.patch("/:adminId/reset-password", (0, activityLogger_1.createActivityLogger)({
    action: "RESET_ADMIN_PASSWORD",
    resource: "User",
    category: "user_management",
    severity: "high",
}), adminController_1.resetAdminPassword);
router.patch("/:adminId/update-password", (0, activityLogger_1.createActivityLogger)({
    action: "UPDATE_ADMIN_PASSWORD",
    resource: "User",
    category: "user_management",
    severity: "high",
}), adminController_1.updateAdminPassword);
router.get("/activity-logs", adminController_1.getActivityLogs);
router.get("/dashboard", (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Admin dashboard endpoint",
    });
});
exports.default = router;
//# sourceMappingURL=admin.routes.js.map