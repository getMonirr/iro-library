import express from "express";
import { authenticate } from "../middleware/auth";

const router = express.Router();

// Placeholder routes
router.get("/", authenticate, (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Borrow routes endpoint",
  });
});

export default router;
