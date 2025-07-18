"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.updatePassword = exports.resetPassword = exports.forgotPassword = exports.logout = exports.login = exports.signup = void 0;
const crypto_1 = __importDefault(require("crypto"));
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config/config"));
const errorHandler_1 = require("../middleware/errorHandler");
const User_1 = __importDefault(require("../models/User"));
const signToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, config_1.default.JWT_SECRET, {
        expiresIn: "7d",
    });
};
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    user.password = undefined;
    res.status(statusCode).json({
        status: "success",
        token,
        data: {
            user,
        },
    });
};
exports.signup = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: "error",
            message: "Validation failed",
            errors: errors.array(),
        });
    }
    const { firstName, lastName, email, phone, password, role = "member", dateOfBirth, address, occupation, } = req.body;
    const existingUser = await User_1.default.findOne({
        $or: [email ? { email } : {}, phone ? { phone } : {}].filter((obj) => Object.keys(obj).length > 0),
    });
    if (existingUser) {
        return res.status(400).json({
            status: "error",
            message: "User already exists with this email or phone number",
        });
    }
    const newUser = await User_1.default.create({
        firstName,
        lastName,
        email,
        phone,
        password,
        role,
        dateOfBirth,
        address,
        occupation,
    });
    createSendToken(newUser, 201, res);
});
exports.login = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: "error",
            message: "Validation failed",
            errors: errors.array(),
        });
    }
    const { identifier, password } = req.body;
    if (!identifier || !password) {
        return res.status(400).json({
            status: "error",
            message: "Please provide email/phone and password!",
        });
    }
    const user = await User_1.default.findOne({
        $or: [{ email: identifier }, { phone: identifier }],
    }).select("+password");
    if (!user) {
        return res.status(401).json({
            status: "error",
            message: "Incorrect email/phone or password",
        });
    }
    if (user.isLocked) {
        return res.status(401).json({
            status: "error",
            message: "Account is temporarily locked due to too many failed login attempts",
        });
    }
    const correct = await user.comparePassword(password);
    if (!correct) {
        await user.incLoginAttempts();
        return res.status(401).json({
            status: "error",
            message: "Incorrect email/phone or password",
        });
    }
    if (!user.isActive) {
        return res.status(401).json({
            status: "error",
            message: "Your account has been deactivated. Please contact support.",
        });
    }
    await User_1.default.findByIdAndUpdate(user._id, {
        $unset: { loginAttempts: 1, lockUntil: 1 },
        lastLogin: new Date(),
    });
    createSendToken(user, 200, res);
});
const logout = (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Logged out successfully",
    });
};
exports.logout = logout;
exports.forgotPassword = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { identifier } = req.body;
    if (!identifier) {
        return res.status(400).json({
            status: "error",
            message: "Please provide email or phone number",
        });
    }
    const user = await User_1.default.findOne({
        $or: [{ email: identifier }, { phone: identifier }],
    });
    if (!user) {
        return res.status(404).json({
            status: "error",
            message: "There is no user with that email/phone number.",
        });
    }
    const resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });
    res.status(200).json({
        status: "success",
        message: "Password reset token sent to your email/phone!",
        ...(config_1.default.NODE_ENV === "development" && { resetToken }),
    });
});
exports.resetPassword = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { token, password, passwordConfirm } = req.body;
    if (!token || !password || !passwordConfirm) {
        return res.status(400).json({
            status: "error",
            message: "Please provide token, password, and password confirmation",
        });
    }
    if (password !== passwordConfirm) {
        return res.status(400).json({
            status: "error",
            message: "Passwords do not match",
        });
    }
    const hashedToken = crypto_1.default.createHash("sha256").update(token).digest("hex");
    const user = await User_1.default.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
        return res.status(400).json({
            status: "error",
            message: "Token is invalid or has expired",
        });
    }
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    createSendToken(user, 200, res);
});
exports.updatePassword = (0, errorHandler_1.catchAsync)(async (req, res) => {
    const { currentPassword, password, passwordConfirm } = req.body;
    if (!currentPassword || !password || !passwordConfirm) {
        return res.status(400).json({
            status: "error",
            message: "Please provide current password, new password, and confirmation",
        });
    }
    if (password !== passwordConfirm) {
        return res.status(400).json({
            status: "error",
            message: "New passwords do not match",
        });
    }
    const user = await User_1.default.findById(req.user._id).select("+password");
    if (!(await user.comparePassword(currentPassword))) {
        return res.status(401).json({
            status: "error",
            message: "Your current password is wrong.",
        });
    }
    user.password = password;
    await user.save();
    createSendToken(user, 200, res);
});
const getMe = (req, res) => {
    res.status(200).json({
        status: "success",
        data: {
            user: req.user,
        },
    });
};
exports.getMe = getMe;
//# sourceMappingURL=auth.controller.js.map