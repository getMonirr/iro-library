"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePublisherUpdate = exports.validatePublisher = void 0;
const express_validator_1 = require("express-validator");
exports.validatePublisher = [
    (0, express_validator_1.body)("name")
        .notEmpty()
        .withMessage("Publisher name is required")
        .isLength({ min: 2, max: 200 })
        .withMessage("Publisher name must be between 2 and 200 characters")
        .trim(),
    (0, express_validator_1.body)("description")
        .optional()
        .isLength({ max: 1000 })
        .withMessage("Description cannot exceed 1000 characters")
        .trim(),
    (0, express_validator_1.body)("website")
        .optional()
        .isURL()
        .withMessage("Please provide a valid website URL"),
    (0, express_validator_1.body)("email")
        .optional()
        .isEmail()
        .withMessage("Please provide a valid email address")
        .normalizeEmail(),
    (0, express_validator_1.body)("phone").optional().trim(),
    (0, express_validator_1.body)("address.street").optional().trim(),
    (0, express_validator_1.body)("address.city").optional().trim(),
    (0, express_validator_1.body)("address.state").optional().trim(),
    (0, express_validator_1.body)("address.country").optional().trim(),
    (0, express_validator_1.body)("address.zipCode").optional().trim(),
    (0, express_validator_1.body)("establishedYear")
        .optional()
        .isInt({ min: 1000, max: new Date().getFullYear() })
        .withMessage(`Established year must be between 1000 and ${new Date().getFullYear()}`),
    (0, express_validator_1.body)("logo").optional().trim(),
    (0, express_validator_1.body)("isActive")
        .optional()
        .isBoolean()
        .withMessage("isActive must be a boolean value"),
];
exports.validatePublisherUpdate = [
    (0, express_validator_1.body)("name")
        .optional()
        .isLength({ min: 2, max: 200 })
        .withMessage("Publisher name must be between 2 and 200 characters")
        .trim(),
    (0, express_validator_1.body)("description")
        .optional()
        .isLength({ max: 1000 })
        .withMessage("Description cannot exceed 1000 characters")
        .trim(),
    (0, express_validator_1.body)("website")
        .optional()
        .isURL()
        .withMessage("Please provide a valid website URL"),
    (0, express_validator_1.body)("email")
        .optional()
        .isEmail()
        .withMessage("Please provide a valid email address")
        .normalizeEmail(),
    (0, express_validator_1.body)("phone").optional().trim(),
    (0, express_validator_1.body)("address.street").optional().trim(),
    (0, express_validator_1.body)("address.city").optional().trim(),
    (0, express_validator_1.body)("address.state").optional().trim(),
    (0, express_validator_1.body)("address.country").optional().trim(),
    (0, express_validator_1.body)("address.zipCode").optional().trim(),
    (0, express_validator_1.body)("establishedYear")
        .optional()
        .isInt({ min: 1000, max: new Date().getFullYear() })
        .withMessage(`Established year must be between 1000 and ${new Date().getFullYear()}`),
    (0, express_validator_1.body)("logo").optional().trim(),
    (0, express_validator_1.body)("isActive")
        .optional()
        .isBoolean()
        .withMessage("isActive must be a boolean value"),
];
//# sourceMappingURL=publisher.validator.js.map