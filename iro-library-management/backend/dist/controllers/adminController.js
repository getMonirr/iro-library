"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActivityLogs = exports.updateAdminPassword = exports.resetAdminPassword = exports.toggleAdminStatus = exports.getAllAdmins = exports.changeFirstLoginPassword = exports.createAdmin = void 0;
const activityLogger_1 = require("../middleware/activityLogger");
const errorHandler_1 = require("../middleware/errorHandler");
const ActivityLog_1 = __importDefault(require("../models/ActivityLog"));
const User_1 = __importDefault(require("../models/User"));
const generateRandomPassword = () => {
    const length = 12;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return password;
};
exports.createAdmin = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
    const { firstName, lastName, email, phone, role = "admin" } = req.body;
    if (req.user?.role !== "super_admin") {
        res.status(403).json({
            status: "error",
            message: "Only super administrators can create admin accounts",
        });
        return;
    }
    if (!firstName || !lastName || (!email && !phone)) {
        res.status(400).json({
            status: "error",
            message: "First name, last name, and either email or phone are required",
        });
        return;
    }
    const existingUser = await User_1.default.findOne({
        $or: [...(email ? [{ email }] : []), ...(phone ? [{ phone }] : [])],
    });
    if (existingUser) {
        res.status(400).json({
            status: "error",
            message: "User with this email or phone already exists",
        });
        return;
    }
    const temporaryPassword = generateRandomPassword();
    const newAdmin = await User_1.default.create({
        firstName,
        lastName,
        email,
        phone,
        password: temporaryPassword,
        role: role === "super_admin" ? "admin" : role,
        isActive: true,
        createdBy: req.user._id,
        mustChangePassword: true,
        isFirstLogin: true,
    });
    await (0, activityLogger_1.logActivity)(req, {
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
});
exports.changeFirstLoginPassword = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
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
    const user = await User_1.default.findById(req.user?._id);
    if (!user) {
        res.status(404).json({
            status: "error",
            message: "User not found",
        });
        return;
    }
    user.password = newPassword;
    user.mustChangePassword = requirePasswordChange;
    user.isFirstLogin = false;
    await user.save();
    await (0, activityLogger_1.logActivity)(req, {
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
});
exports.getAllAdmins = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
    if (req.user?.role !== "super_admin") {
        res.status(403).json({
            status: "error",
            message: "Only super administrators can view admin accounts",
        });
        return;
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search;
    const role = req.query.role;
    const skip = (page - 1) * limit;
    const query = {
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
        User_1.default.find(query)
            .populate("createdBy", "firstName lastName email")
            .select("-password")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit),
        User_1.default.countDocuments(query),
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
});
exports.toggleAdminStatus = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
    const { adminId } = req.params;
    const { isActive } = req.body;
    if (req.user?.role !== "super_admin") {
        res.status(403).json({
            status: "error",
            message: "Only super administrators can modify admin accounts",
        });
        return;
    }
    const admin = await User_1.default.findById(adminId);
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
    await (0, activityLogger_1.logActivity)(req, {
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
});
exports.resetAdminPassword = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
    const { adminId } = req.params;
    if (req.user?.role !== "super_admin") {
        res.status(403).json({
            status: "error",
            message: "Only super administrators can reset admin passwords",
        });
        return;
    }
    const admin = await User_1.default.findById(adminId);
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
    const newTemporaryPassword = generateRandomPassword();
    admin.password = newTemporaryPassword;
    admin.mustChangePassword = true;
    admin.isFirstLogin = false;
    await admin.save();
    await (0, activityLogger_1.logActivity)(req, {
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
});
exports.updateAdminPassword = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
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
    const admin = await User_1.default.findById(adminId);
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
    admin.password = newPassword;
    admin.mustChangePassword = requirePasswordChange;
    await admin.save();
    await (0, activityLogger_1.logActivity)(req, {
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
});
exports.getActivityLogs = (0, errorHandler_1.catchAsync)(async (req, res, next) => {
    if (req.user?.role !== "super_admin") {
        res.status(403).json({
            status: "error",
            message: "Only super administrators can view activity logs",
        });
        return;
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const category = req.query.category;
    const severity = req.query.severity;
    const userId = req.query.userId;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const skip = (page - 1) * limit;
    const query = {};
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
        ActivityLog_1.default.find(query)
            .populate("user", "firstName lastName email role")
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit),
        ActivityLog_1.default.countDocuments(query),
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
});
exports.default = {
    createAdmin: exports.createAdmin,
    changeFirstLoginPassword: exports.changeFirstLoginPassword,
    getAllAdmins: exports.getAllAdmins,
    toggleAdminStatus: exports.toggleAdminStatus,
    resetAdminPassword: exports.resetAdminPassword,
    updateAdminPassword: exports.updateAdminPassword,
    getActivityLogs: exports.getActivityLogs,
};
//# sourceMappingURL=adminController.js.map