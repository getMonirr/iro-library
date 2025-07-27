import { Router } from "express";
import {
  createPublisher,
  deletePublisher,
  getActivePublishers,
  getAllPublishers,
  getPublisher,
  updatePublisher,
} from "../controllers/publisher.controller";
import { adminAuth } from "../middleware/adminAuth";
import { authenticate } from "../middleware/auth";
import {
  validatePublisher,
  validatePublisherUpdate,
} from "../validators/publisher.validator";

const router = Router();

// Public routes (or authenticated user routes)
router.get("/", authenticate, getAllPublishers);
router.get("/active", authenticate, getActivePublishers);
router.get("/:id", authenticate, getPublisher);

// Admin routes
router.post("/", authenticate, adminAuth, validatePublisher, createPublisher);
router.patch(
  "/:id",
  authenticate,
  adminAuth,
  validatePublisherUpdate,
  updatePublisher
);
router.delete("/:id", authenticate, adminAuth, deletePublisher);

export default router;
