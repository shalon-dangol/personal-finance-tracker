import express from 'express';
const router = express.Router();
import { getUsers, getUserById, createUser } from '../features/user/userController.js';

router.get('/', getUsers);
router.post('/', createUser);
router.get('/:id', getUserById);

export default router;
