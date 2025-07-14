"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
const signupValidation = [
    (0, express_validator_1.body)("firstName")
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage("First name must be between 2 and 50 characters"),
    (0, express_validator_1.body)("lastName")
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage("Last name must be between 2 and 50 characters"),
    (0, express_validator_1.body)("email")
        .optional()
        .isEmail()
        .normalizeEmail()
        .withMessage("Please provide a valid email"),
    (0, express_validator_1.body)("phone")
        .optional()
        .isMobilePhone("any")
        .withMessage("Please provide a valid phone number"),
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage("Password must contain at least one lowercase letter, one uppercase letter, and one number"),
    (0, express_validator_1.body)().custom((value, { req }) => {
        if (!req.body.email && !req.body.phone) {
            throw new Error("Either email or phone number is required");
        }
        return true;
    }),
];
const loginValidation = [
    (0, express_validator_1.body)("identifier")
        .notEmpty()
        .withMessage("Email or phone number is required"),
    (0, express_validator_1.body)("password").notEmpty().withMessage("Password is required"),
];
const forgotPasswordValidation = [
    (0, express_validator_1.body)("identifier")
        .notEmpty()
        .withMessage("Email or phone number is required"),
];
const resetPasswordValidation = [
    (0, express_validator_1.body)("token").notEmpty().withMessage("Reset token is required"),
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters long"),
    (0, express_validator_1.body)("passwordConfirm")
        .notEmpty()
        .withMessage("Password confirmation is required"),
];
const updatePasswordValidation = [
    (0, express_validator_1.body)("currentPassword")
        .notEmpty()
        .withMessage("Current password is required"),
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 })
        .withMessage("New password must be at least 6 characters long"),
    (0, express_validator_1.body)("passwordConfirm")
        .notEmpty()
        .withMessage("Password confirmation is required"),
];
router.post("/signup", signupValidation, auth_controller_1.signup);
router.post("/login", loginValidation, auth_controller_1.login);
router.post("/logout", auth_controller_1.logout);
router.post("/forgot-password", forgotPasswordValidation, auth_controller_1.forgotPassword);
router.patch("/reset-password", resetPasswordValidation, auth_controller_1.resetPassword);
router.use(auth_1.authenticate);
router.get("/me", auth_controller_1.getMe);
router.patch("/update-password", updatePasswordValidation, auth_controller_1.updatePassword);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map