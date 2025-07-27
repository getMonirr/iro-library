import { body } from "express-validator";

export const validatePublisher = [
  body("name")
    .notEmpty()
    .withMessage("Publisher name is required")
    .isLength({ min: 2, max: 200 })
    .withMessage("Publisher name must be between 2 and 200 characters")
    .trim(),

  body("description")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters")
    .trim(),

  body("website")
    .optional()
    .isURL()
    .withMessage("Please provide a valid website URL"),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("phone").optional().trim(),

  body("address.street").optional().trim(),

  body("address.city").optional().trim(),

  body("address.state").optional().trim(),

  body("address.country").optional().trim(),

  body("address.zipCode").optional().trim(),

  body("establishedYear")
    .optional()
    .isInt({ min: 1000, max: new Date().getFullYear() })
    .withMessage(
      `Established year must be between 1000 and ${new Date().getFullYear()}`
    ),

  body("logo").optional().trim(),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean value"),
];

export const validatePublisherUpdate = [
  body("name")
    .optional()
    .isLength({ min: 2, max: 200 })
    .withMessage("Publisher name must be between 2 and 200 characters")
    .trim(),

  body("description")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters")
    .trim(),

  body("website")
    .optional()
    .isURL()
    .withMessage("Please provide a valid website URL"),

  body("email")
    .optional()
    .isEmail()
    .withMessage("Please provide a valid email address")
    .normalizeEmail(),

  body("phone").optional().trim(),

  body("address.street").optional().trim(),

  body("address.city").optional().trim(),

  body("address.state").optional().trim(),

  body("address.country").optional().trim(),

  body("address.zipCode").optional().trim(),

  body("establishedYear")
    .optional()
    .isInt({ min: 1000, max: new Date().getFullYear() })
    .withMessage(
      `Established year must be between 1000 and ${new Date().getFullYear()}`
    ),

  body("logo").optional().trim(),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean value"),
];
