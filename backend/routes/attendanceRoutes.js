import express from "express";
import { getMonthlyAttendance } from "../controllers/attendanceController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get(
  "/attendance/monthly",
  authMiddleware,
  roleMiddleware("admin"),
  getMonthlyAttendance
);

export default router;
