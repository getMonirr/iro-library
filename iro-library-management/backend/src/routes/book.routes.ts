import express from "express";
import { body } from "express-validator";
import {
  createBook,
  deleteBook,
  getAllBooks,
  getBook,
  getBookCategories,
  getBookFormData,
  getFeaturedBooks,
  getLibraryStats,
  getPopularBooks,
  searchBooks,
  updateBook,
} from "../controllers/book.controller";
import { authenticate, authorize, optionalAuth } from "../middleware/auth";

const router = express.Router();

// Book validation rules
const createBookValidation = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Title is required and must be between 1 and 200 characters"),
  body("authors")
    .isArray({ min: 1 })
    .withMessage("At least one author is required"),
  body("authors.*")
    .trim()
    .isLength({ min: 1 })
    .withMessage("Author name cannot be empty"),
  body("categories")
    .isArray({ min: 1 })
    .withMessage("At least one category is required"),
  body("language")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Language cannot be empty"),
  body("totalCopies")
    .isInt({ min: 1 })
    .withMessage("Total copies must be at least 1"),
  body("availableCopies")
    .isInt({ min: 0 })
    .withMessage("Available copies cannot be negative"),
  body("format")
    .isIn(["physical", "digital", "both"])
    .withMessage("Format must be physical, digital, or both"),
  body("location.shelf")
    .if(body("format").isIn(["physical", "both"]))
    .notEmpty()
    .withMessage("Shelf is required for physical books"),
  body("location.section")
    .if(body("format").isIn(["physical", "both"]))
    .notEmpty()
    .withMessage("Section is required for physical books"),
];

const updateBookValidation = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage("Title must be between 1 and 200 characters"),
  body("authors")
    .optional()
    .isArray({ min: 1 })
    .withMessage("At least one author is required"),
  body("totalCopies")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Total copies must be at least 1"),
  body("availableCopies")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Available copies cannot be negative"),
];

// Public routes (no authentication required)
router.get("/search", searchBooks);
router.get("/featured", getFeaturedBooks);
router.get("/popular", getPopularBooks);
router.get("/categories", getBookCategories);
router.get("/stats", getLibraryStats);
router.get("/form-data", getBookFormData);

// Public routes with optional authentication
router.get("/", optionalAuth, getAllBooks);
router.get("/:id", optionalAuth, getBook);

// Protected routes (authentication required)
router.use(authenticate);

// Admin/Librarian only routes
router.post(
  "/",
  authorize("admin", "librarian"),
  createBookValidation,
  createBook
);
router.patch(
  "/:id",
  authorize("admin", "librarian"),
  updateBookValidation,
  updateBook
);
router.delete("/:id", authorize("admin", "librarian"), deleteBook);

export default router;
