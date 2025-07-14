import express from "express";
import { authenticate, authorize } from "../middleware/auth";

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(authorize("admin"));

// Placeholder routes
router.get("/dashboard", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Admin dashboard endpoint",
  });
});

export default router;
