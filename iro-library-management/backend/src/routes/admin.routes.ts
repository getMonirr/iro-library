import express from "express";
import {
  changeFirstLoginPassword,
  createAdmin,
  getActivityLogs,
  getAllAdmins,
  resetAdminPassword,
  toggleAdminStatus,
  updateAdminPassword,
} from "../controllers/adminController";
import { createActivityLogger } from "../middleware/activityLogger";
import { authenticate, authorize } from "../middleware/auth";

const router = express.Router();

// All admin routes require authentication
router.use(authenticate);

// Change password after first login (any admin can do this for themselves)
router.patch(
  "/change-first-login-password",
  createActivityLogger({
    action: "CHANGE_FIRST_LOGIN_PASSWORD",
    resource: "User",
    category: "auth",
    severity: "medium",
  }),
  changeFirstLoginPassword
);

// Super admin only routes
router.use(authorize("super_admin"));

// Create new admin
router.post(
  "/create",
  createActivityLogger({
    action: "CREATE_ADMIN",
    resource: "User",
    category: "user_management",
    severity: "high",
  }),
  createAdmin
);

// Get all admins
router.get("/admins", getAllAdmins);

// Toggle admin status (activate/deactivate)
router.patch(
  "/:adminId/toggle-status",
  createActivityLogger({
    action: "TOGGLE_ADMIN_STATUS",
    resource: "User",
    category: "user_management",
    severity: "high",
  }),
  toggleAdminStatus
);

// Reset admin password
router.patch(
  "/:adminId/reset-password",
  createActivityLogger({
    action: "RESET_ADMIN_PASSWORD",
    resource: "User",
    category: "user_management",
    severity: "high",
  }),
  resetAdminPassword
);

// Update admin password
router.patch(
  "/:adminId/update-password",
  createActivityLogger({
    action: "UPDATE_ADMIN_PASSWORD",
    resource: "User",
    category: "user_management",
    severity: "high",
  }),
  updateAdminPassword
);

// Get activity logs
router.get("/activity-logs", getActivityLogs);

// Placeholder dashboard route
router.get("/dashboard", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Admin dashboard endpoint",
  });
});

export default router;
