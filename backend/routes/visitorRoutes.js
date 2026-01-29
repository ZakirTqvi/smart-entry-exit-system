import express from "express";
import { visitorEntry, visitorExit } from "../controllers/visitorController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/visitor/entry",
  authMiddleware,
  roleMiddleware("admin", "guard"),
  visitorEntry
);

router.post(
  "/visitor/exit",
  authMiddleware,
  roleMiddleware("admin", "guard"),
  visitorExit
);

export default router;
