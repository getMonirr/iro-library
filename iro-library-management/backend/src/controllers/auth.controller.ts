import crypto from "crypto";
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import config from "../config/config";
import { AuthenticatedRequest } from "../middleware/auth";
import { catchAsync } from "../middleware/errorHandler";
import User, { IUser } from "../models/User";

const signToken = (id: string) => {
  return jwt.sign({ id }, config.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const createSendToken = (user: IUser, statusCode: number, res: Response) => {
  const token = signToken(user._id);

  // Remove password from output
  user.password = undefined as any;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

export const signup = catchAsync(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    role = "member",
    dateOfBirth,
    address,
    occupation,
  } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [email ? { email } : {}, phone ? { phone } : {}].filter(
      (obj) => Object.keys(obj).length > 0
    ),
  });

  if (existingUser) {
    return res.status(400).json({
      status: "error",
      message: "User already exists with this email or phone number",
    });
  }

  const newUser = await User.create({
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

export const login = catchAsync(async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: "error",
      message: "Validation failed",
      errors: errors.array(),
    });
  }

  const { identifier, password } = req.body; // identifier can be email or phone

  // Check if identifier and password exist
  if (!identifier || !password) {
    return res.status(400).json({
      status: "error",
      message: "Please provide email/phone and password!",
    });
  }

  // Check if user exists && password is correct
  const user = await User.findOne({
    $or: [{ email: identifier }, { phone: identifier }],
  }).select("+password");

  if (!user) {
    return res.status(401).json({
      status: "error",
      message: "Incorrect email/phone or password",
    });
  }

  // Check if account is locked
  if (user.isLocked) {
    return res.status(401).json({
      status: "error",
      message:
        "Account is temporarily locked due to too many failed login attempts",
    });
  }

  const correct = await user.comparePassword(password);

  if (!correct) {
    // Increment login attempts
    await user.incLoginAttempts();
    return res.status(401).json({
      status: "error",
      message: "Incorrect email/phone or password",
    });
  }

  // Check if user is active
  if (!user.isActive) {
    return res.status(401).json({
      status: "error",
      message: "Your account has been deactivated. Please contact support.",
    });
  }

  // Reset login attempts and update last login
  await User.findByIdAndUpdate(user._id, {
    $unset: { loginAttempts: 1, lockUntil: 1 },
    lastLogin: new Date(),
  });

  createSendToken(user, 200, res);
});

export const logout = (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};

export const forgotPassword = catchAsync(
  async (req: Request, res: Response) => {
    const { identifier } = req.body; // email or phone

    if (!identifier) {
      return res.status(400).json({
        status: "error",
        message: "Please provide email or phone number",
      });
    }

    // Get user based on email or phone
    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }],
    });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "There is no user with that email/phone number.",
      });
    }

    // Generate the random reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // TODO: Send the token via email/SMS
    // For now, we'll just return success message

    res.status(200).json({
      status: "success",
      message: "Password reset token sent to your email/phone!",
      // In development, return the token for testing
      ...(config.NODE_ENV === "development" && { resetToken }),
    });
  }
);

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
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

  // Get user based on the token
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // If token has not expired, and there is user, set the new password
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

  // Log the user in, send JWT
  createSendToken(user, 200, res);
});

export const updatePassword = catchAsync(
  async (req: AuthenticatedRequest, res: Response) => {
    const { currentPassword, password, passwordConfirm } = req.body;

    if (!currentPassword || !password || !passwordConfirm) {
      return res.status(400).json({
        status: "error",
        message:
          "Please provide current password, new password, and confirmation",
      });
    }

    if (password !== passwordConfirm) {
      return res.status(400).json({
        status: "error",
        message: "New passwords do not match",
      });
    }

    // Get user from collection
    const user = await User.findById(req.user!._id).select("+password");

    // Check if current password is correct
    if (!(await user!.comparePassword(currentPassword))) {
      return res.status(401).json({
        status: "error",
        message: "Your current password is wrong.",
      });
    }

    // Update password
    user!.password = password;
    await user!.save();

    // Log user in, send JWT
    createSendToken(user!, 200, res);
  }
);

export const getMe = (req: AuthenticatedRequest, res: Response) => {
  res.status(200).json({
    status: "success",
    data: {
      user: req.user,
    },
  });
};
