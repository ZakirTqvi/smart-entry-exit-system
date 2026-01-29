// backend/routes/entrylogRoutes.js
import express from "express";
import { getEntryLogs } from "../controllers/entrylogController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// Route to get entry logs (Admin only)
router.get(
  "/entry/logs",
  authMiddleware,
  roleMiddleware("admin"),
  getEntryLogs
);

export default router;