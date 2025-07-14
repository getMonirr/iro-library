import express from "express";
import { body } from "express-validator";
import {
  forgotPassword,
  getMe,
  login,
  logout,
  resetPassword,
  signup,
  updatePassword,
} from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth";

const router = express.Router();

// Validation rules
const signupValidation = [
  body("firstName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters"),
  body("lastName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters"),
  body("email")
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email"),
  body("phone")
    .optional()
    .isMobilePhone("any")
    .withMessage("Please provide a valid phone number"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one lowercase letter, one uppercase letter, and one number"
    ),
  body().custom((value, { req }) => {
    if (!req.body.email && !req.body.phone) {
      throw new Error("Either email or phone number is required");
    }
    return true;
  }),
];

const loginValidation = [
  body("identifier")
    .notEmpty()
    .withMessage("Email or phone number is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

const forgotPasswordValidation = [
  body("identifier")
    .notEmpty()
    .withMessage("Email or phone number is required"),
];

const resetPasswordValidation = [
  body("token").notEmpty().withMessage("Reset token is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirmation is required"),
];

const updatePasswordValidation = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long"),
  body("passwordConfirm")
    .notEmpty()
    .withMessage("Password confirmation is required"),
];

// Routes
router.post("/signup", signupValidation, signup);
router.post("/login", loginValidation, login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPasswordValidation, forgotPassword);
router.patch("/reset-password", resetPasswordValidation, resetPassword);

// Protected routes
router.use(authenticate); // Protect all routes after this middleware

router.get("/me", getMe);
router.patch("/update-password", updatePasswordValidation, updatePassword);

export default router;
