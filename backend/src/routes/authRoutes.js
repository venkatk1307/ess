// backend/src/routes/authRoutes.js
import express from 'express';
import { authenticateUser } from '../controllers/authController';

const router = express.Router();

// Define the /auth POST endpoint for authentication
router.post('/auth', authenticateUser);


export default router;
