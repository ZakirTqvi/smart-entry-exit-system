import express from "express";
import { createUser, getAllUsers,updateUserStatus } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// Create student / teaching / non-teaching user (Admin only)
router.post(
  "/users/create",
  authMiddleware,
  roleMiddleware("admin"),
  createUser
);

// Get all users (Admin only)
router.get("/users", 
    authMiddleware, 
    roleMiddleware("admin"), 
    getAllUsers);

// Update user status (activate/deactivate) (Admin only)
router.patch(
  "/users/:id/status",
  authMiddleware,
  roleMiddleware("admin"),
  updateUserStatus
);

export default router;
