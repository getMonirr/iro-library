import { NextFunction, Response } from "express";
import { logActivity } from "../middleware/activityLogger";
import { AuthenticatedRequest } from "../middleware/auth";
import { catchAsync } from "../middleware/errorHandler";
import ActivityLog from "../models/ActivityLog";
import User from "../models/User";

// Generate random password
const generateRandomPassword = (): string => {
  const length = 12;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
};

// Create admin (only super_admin can do this)
export const createAdmin = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { firstName, lastName, email, phone, role = "admin" } = req.body;

    // Check if user is super admin
    if (req.user?.role !== "super_admin") {
      res.status(403).json({
        status: "error",
        message: "Only super administrators can create admin accounts",
      });
      return;
    }

    // Validate required fields
    if (!firstName || !lastName || (!email && !phone)) {
      res.status(400).json({
        status: "error",
        message:
          "First name, last name, and either email or phone are required",
      });
      return;
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [...(email ? [{ email }] : []), ...(phone ? [{ phone }] : [])],
    });

    if (existingUser) {
      res.status(400).json({
        status: "error",
        message: "User with this email or phone already exists",
      });
      return;
    }

    // Generate temporary password
    const temporaryPassword = generateRandomPassword();

    // Create new admin
    const newAdmin = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password: temporaryPassword,
      role: role === "super_admin" ? "admin" : role, // Prevent creating super_admin
      isActive: true,
      createdBy: req.user._id,
      mustChangePassword: true,
      isFirstLogin: true,
    });

    // Log activity
    await logActivity(req, {
      action: "CREATE_ADMIN",
      resource: "User",
      resourceId: newAdmin._id,
      details: {
        adminEmail: email,
        adminPhone: phone,
        adminRole: newAdmin.role,
        createdBy: req.user._id,
      },
      severity: "high",
      category: "user_management",
    });

    // Return admin details with temporary password
    res.status(201).json({
      status: "success",
      message: "Admin created successfully",
      data: {
        admin: {
          _id: newAdmin._id,
          firstName: newAdmin.firstName,
          lastName: newAdmin.lastName,
          email: newAdmin.email,
          phone: newAdmin.phone,
          role: newAdmin.role,
          isActive: newAdmin.isActive,
          createdAt: newAdmin.createdAt,
        },
        temporaryPassword,
        message: "Admin must change password on first login",
      },
    });
  }
);

// Change password after first login
export const changeFirstLoginPassword = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { newPassword, requirePasswordChange = false } = req.body;

    if (!newPassword) {
      res.status(400).json({
        status: "error",
        message: "New password is required",
      });
      return;
    }

    if (newPassword.length < 8) {
      res.status(400).json({
        status: "error",
        message: "New password must be at least 8 characters long",
      });
      return;
    }

    const user = await User.findById(req.user?._id);
    if (!user) {
      res.status(404).json({
        status: "error",
        message: "User not found",
      });
      return;
    }

    // Update password and reset flags
    user.password = newPassword;
    user.mustChangePassword = requirePasswordChange;
    user.isFirstLogin = false;
    await user.save();

    // Log activity
    await logActivity(req, {
      action: "CHANGE_FIRST_LOGIN_PASSWORD",
      resource: "User",
      resourceId: user._id,
      details: {
        userId: user._id,
        userRole: user.role,
      },
      severity: "medium",
      category: "auth",
    });

    res.status(200).json({
      status: "success",
      message: "Password changed successfully",
    });
  }
);

// Get all admins (only super_admin can view)
export const getAllAdmins = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== "super_admin") {
      res.status(403).json({
        status: "error",
        message: "Only super administrators can view admin accounts",
      });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string;
    const role = req.query.role as string;

    const skip = (page - 1) * limit;

    // Build query
    const query: any = {
      role: { $in: ["admin", "librarian"] },
    };

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role && ["admin", "librarian"].includes(role)) {
      query.role = role;
    }

    const [admins, total] = await Promise.all([
      User.find(query)
        .populate("createdBy", "firstName lastName email")
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      User.countDocuments(query),
    ]);

    res.status(200).json({
      status: "success",
      data: {
        admins,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalAdmins: total,
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      },
    });
  }
);

// Deactivate/Activate admin
export const toggleAdminStatus = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { adminId } = req.params;
    const { isActive } = req.body;

    if (req.user?.role !== "super_admin") {
      res.status(403).json({
        status: "error",
        message: "Only super administrators can modify admin accounts",
      });
      return;
    }

    const admin = await User.findById(adminId);
    if (!admin) {
      res.status(404).json({
        status: "error",
        message: "Admin not found",
      });
      return;
    }

    if (admin.role === "super_admin") {
      res.status(403).json({
        status: "error",
        message: "Cannot modify super administrator account",
      });
      return;
    }

    admin.isActive = isActive;
    await admin.save();

    // Log activity
    await logActivity(req, {
      action: isActive ? "ACTIVATE_ADMIN" : "DEACTIVATE_ADMIN",
      resource: "User",
      resourceId: admin._id,
      details: {
        adminId: admin._id,
        adminEmail: admin.email,
        adminRole: admin.role,
        newStatus: isActive,
      },
      severity: "high",
      category: "user_management",
    });

    res.status(200).json({
      status: "success",
      message: `Admin ${isActive ? "activated" : "deactivated"} successfully`,
      data: {
        admin: {
          _id: admin._id,
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email,
          isActive: admin.isActive,
        },
      },
    });
  }
);

// Reset admin password (super_admin only)
export const resetAdminPassword = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { adminId } = req.params;

    if (req.user?.role !== "super_admin") {
      res.status(403).json({
        status: "error",
        message: "Only super administrators can reset admin passwords",
      });
      return;
    }

    const admin = await User.findById(adminId);
    if (!admin) {
      res.status(404).json({
        status: "error",
        message: "Admin not found",
      });
      return;
    }

    if (admin.role === "super_admin") {
      res.status(403).json({
        status: "error",
        message: "Cannot reset super administrator password",
      });
      return;
    }

    // Generate new temporary password
    const newTemporaryPassword = generateRandomPassword();
    admin.password = newTemporaryPassword;
    admin.mustChangePassword = true;
    admin.isFirstLogin = false; // Keep false since they've logged in before
    await admin.save();

    // Log activity
    await logActivity(req, {
      action: "RESET_ADMIN_PASSWORD",
      resource: "User",
      resourceId: admin._id,
      details: {
        adminId: admin._id,
        adminEmail: admin.email,
        adminRole: admin.role,
        resetBy: req.user._id,
      },
      severity: "high",
      category: "user_management",
    });

    res.status(200).json({
      status: "success",
      message: "Admin password reset successfully",
      data: {
        temporaryPassword: newTemporaryPassword,
        message: "Admin must change this password on next login",
      },
    });
  }
);

// Update admin password (super_admin only)
export const updateAdminPassword = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { adminId } = req.params;
    const { newPassword, requirePasswordChange = false } = req.body;

    if (req.user?.role !== "super_admin") {
      res.status(403).json({
        status: "error",
        message: "Only super administrators can update admin passwords",
      });
      return;
    }

    if (!newPassword) {
      res.status(400).json({
        status: "error",
        message: "New password is required",
      });
      return;
    }

    if (newPassword.length < 8) {
      res.status(400).json({
        status: "error",
        message: "Password must be at least 8 characters long",
      });
      return;
    }

    const admin = await User.findById(adminId);
    if (!admin) {
      res.status(404).json({
        status: "error",
        message: "Admin not found",
      });
      return;
    }

    if (admin.role === "super_admin") {
      res.status(403).json({
        status: "error",
        message: "Cannot update super administrator password",
      });
      return;
    }

    // Update password
    admin.password = newPassword;
    admin.mustChangePassword = requirePasswordChange;
    await admin.save();

    // Log activity
    await logActivity(req, {
      action: "UPDATE_ADMIN_PASSWORD",
      resource: "User",
      resourceId: admin._id,
      details: {
        adminId: admin._id,
        adminEmail: admin.email,
        adminRole: admin.role,
        updatedBy: req.user._id,
        requirePasswordChange,
      },
      severity: "high",
      category: "user_management",
    });

    res.status(200).json({
      status: "success",
      message: "Admin password updated successfully",
      data: {
        message: requirePasswordChange
          ? "Admin must change this password on next login"
          : "Password updated successfully",
      },
    });
  }
);

// Get activity logs (super_admin only)
export const getActivityLogs = catchAsync(
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== "super_admin") {
      res.status(403).json({
        status: "error",
        message: "Only super administrators can view activity logs",
      });
      return;
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const category = req.query.category as string;
    const severity = req.query.severity as string;
    const userId = req.query.userId as string;
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;

    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};

    if (category) {
      query.category = category;
    }

    if (severity) {
      query.severity = severity;
    }

    if (userId) {
      query.user = userId;
    }

    if (startDate || endDate) {
      query.timestamp = {};
      if (startDate) {
        query.timestamp.$gte = new Date(startDate);
      }
      if (endDate) {
        query.timestamp.$lte = new Date(endDate);
      }
    }

    const [logs, total] = await Promise.all([
      ActivityLog.find(query)
        .populate("user", "firstName lastName email role")
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit),
      ActivityLog.countDocuments(query),
    ]);

    res.status(200).json({
      status: "success",
      data: {
        logs,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalLogs: total,
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      },
    });
  }
);

export default {
  createAdmin,
  changeFirstLoginPassword,
  getAllAdmins,
  toggleAdminStatus,
  resetAdminPassword,
  updateAdminPassword,
  getActivityLogs,
};
