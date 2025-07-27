import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getActiveCategories,
  getAllCategories,
  getCategory,
  updateCategory,
} from "../controllers/category.controller";
import { adminAuth } from "../middleware/adminAuth";
import { authenticate } from "../middleware/auth";
import {
  validateCategory,
  validateCategoryUpdate,
} from "../validators/category.validator";

const router = Router();

// Public routes (or authenticated user routes)
router.get("/", authenticate, getAllCategories);
router.get("/active", authenticate, getActiveCategories);
router.get("/:id", authenticate, getCategory);

// Admin routes
router.post("/", authenticate, adminAuth, validateCategory, createCategory);
router.patch(
  "/:id",
  authenticate,
  adminAuth,
  validateCategoryUpdate,
  updateCategory
);
router.delete("/:id", authenticate, adminAuth, deleteCategory);

export default router;
