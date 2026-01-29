import express from 'express';
import { registerFaceEncoding, recognizeFace } from '../controllers/faceController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';

const router = express.Router();

// Route to register face encoding (Admin only)
router.post(
  '/face/register',
  authMiddleware,
  roleMiddleware('admin'),
  registerFaceEncoding
);

// Face recognition (guard / admin)
router.post(
  '/face/recognize',
  authMiddleware,
  roleMiddleware('admin', 'guard'),
  recognizeFace
);

export default router;
