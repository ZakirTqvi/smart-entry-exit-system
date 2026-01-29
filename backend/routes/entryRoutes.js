// backend/routes/entryRoutes.js
import express from 'express';
import { logEntry, logExit } from '../controllers/entryController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import roleMiddleware from '../middleware/roleMiddleware.js';
import { autoEntryExit } from '../controllers/entryController.js';

const router = express.Router();

// Route to log entry
router.post('/entry', authMiddleware, roleMiddleware('admin', 'guard'), logEntry);

// Route to log exit
router.put('/exit/:id', authMiddleware, roleMiddleware('admin', 'guard'), logExit);

// Auto entry/exit after face recognition
router.post('/entry/auto', authMiddleware, roleMiddleware('admin', 'guard'), autoEntryExit);

export default router;  