// backend/routes/authRoutes.js
import express from "express";
import {
  createAuthUser,
  loginAuthUser,
  resetPasswordByAdmin,
  deactivateGuardByAdmin,
  activateGuardByAdmin,
  getAllGuards
} from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

// Route for user login
router.post("/auth/login", loginAuthUser);

// Route to create a new auth user (protected, only admin can create)
router.post(
  "/auth/create",
  authMiddleware,
  roleMiddleware("admin"),
  createAuthUser
);

// Route to reset password 
router.put(
  "/auth/reset-password/:userId",
  authMiddleware,
  roleMiddleware("admin"),
  resetPasswordByAdmin
);

// Route to deactivate a guard 
router.delete(
  '/auth/deactivate/:userId',
  authMiddleware,
  roleMiddleware('admin'),
  deactivateGuardByAdmin
);

// Route to activate a guard
router.put(
  '/auth/activate/:userId',
  authMiddleware,
  roleMiddleware('admin'),
  activateGuardByAdmin  
);

// Route to get all guards
router.get(
  '/auth/guards', 
  authMiddleware,
  roleMiddleware('admin'),
  getAllGuards
);

// Export the router
export default router;
