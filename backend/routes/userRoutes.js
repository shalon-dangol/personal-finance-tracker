import express from 'express';
const router = express.Router();
import {
  getUsers,
  getUserById,
  createUser,
  registerUser,
  loginUser,
  refreshUser,
  logoutUser,
} from '../features/user/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { registerSchema, loginSchema } from '../features/user/userValidation.js';

router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);
router.post('/refresh', refreshUser);
router.post('/logout', logoutUser);

router.get('/', protect, getUsers);
router.post('/', protect, createUser);
router.get('/:id', protect, getUserById);

export default router;