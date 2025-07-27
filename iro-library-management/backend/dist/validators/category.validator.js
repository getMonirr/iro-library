"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCategoryUpdate = exports.validateCategory = void 0;
const express_validator_1 = require("express-validator");
exports.validateCategory = [
    (0, express_validator_1.body)("name")
        .notEmpty()
        .withMessage("Category name is required")
        .isLength({ min: 2, max: 100 })
        .withMessage("Category name must be between 2 and 100 characters")
        .trim(),
    (0, express_validator_1.body)("description")
        .optional()
        .isLength({ max: 500 })
        .withMessage("Description cannot exceed 500 characters")
        .trim(),
    (0, express_validator_1.body)("isActive")
        .optional()
        .isBoolean()
        .withMessage("isActive must be a boolean value"),
];
exports.validateCategoryUpdate = [
    (0, express_validator_1.body)("name")
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage("Category name must be between 2 and 100 characters")
        .trim(),
    (0, express_validator_1.body)("description")
        .optional()
        .isLength({ max: 500 })
        .withMessage("Description cannot exceed 500 characters")
        .trim(),
    (0, express_validator_1.body)("isActive")
        .optional()
        .isBoolean()
        .withMessage("isActive must be a boolean value"),
];
//# sourceMappingURL=category.validator.js.map