import express from "express";
import {
  createAuthor,
  deleteAuthor,
  getAllAuthors,
  getAuthor,
  getAuthorsForSelect,
  updateAuthor,
} from "../controllers/author.controller";
import { adminAuth } from "../middleware/adminAuth";
import { authenticate } from "../middleware/auth";

const router = express.Router();

// Public routes
router.get("/", getAllAuthors);
router.get("/select", getAuthorsForSelect);
router.get("/:id", getAuthor);

// Protected routes - require authentication
router.use(authenticate);

// Admin only routes
router.use(adminAuth);

router.post("/", createAuthor);
router.patch("/:id", updateAuthor);
router.delete("/:id", deleteAuthor);

export default router;
