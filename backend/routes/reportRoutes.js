// backend/routes/reportRoutes.js
import express from "express";
import {
  getSummaryReport,
  getDailyEntries,
  getRoleDistribution,
  exportLogsCSV,
  exportLogsPDF
} from "../controllers/reportController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/reports/summary", authMiddleware, roleMiddleware("admin"), getSummaryReport);
router.get("/reports/daily-entries", authMiddleware, roleMiddleware("admin"), getDailyEntries);
router.get("/reports/role-distribution", authMiddleware, roleMiddleware("admin"), getRoleDistribution);
router.get("/reports/export/csv", authMiddleware, roleMiddleware("admin"), exportLogsCSV);
router.get("/reports/export/pdf", authMiddleware, roleMiddleware("admin"), exportLogsPDF);

export default router;
