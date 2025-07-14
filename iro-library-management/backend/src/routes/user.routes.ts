import express from "express";
import { authenticate } from "../middleware/auth";

const router = express.Router();

// Placeholder routes - will be implemented based on controllers
router.get("/", authenticate, (req, res) => {
  res.status(200).json({
    status: "success",
    message: "User routes endpoint",
  });
});

export default router;
