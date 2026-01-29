import express from "express";
import { getPeopleInside } from "../controllers/occupancyController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// List of people currently inside
router.get(
  "/occupancy/people",
  authMiddleware,
  roleMiddleware("admin", "guard"),
  getPeopleInside
);

export default router;
