import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  requestPasswordReset,
  resetPassword
} from '../controllers/authController.js';
import {authMiddleware} from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authMiddleware, getUserProfile);
router.post('/request-reset', requestPasswordReset);
router.post('/reset-password/:token', resetPassword);

export default router;
