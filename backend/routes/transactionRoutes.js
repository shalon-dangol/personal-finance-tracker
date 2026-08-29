import express from 'express';
const router = express.Router();
import {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../features/transaction/transactionController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validate.js';
import { createTransactionSchema, updateTransactionSchema, transactionIdSchema, transactionQuerySchema } from '../features/transaction/transactionValidation.js';

router.use(protect);

router.route('/')
  .get(validate(transactionQuerySchema), getTransactions)
  .post(validate(createTransactionSchema), createTransaction);

router.route('/:id')
  .get(validate(transactionIdSchema), getTransactionById)
  .put(validate(updateTransactionSchema), updateTransaction)
  .delete(validate(transactionIdSchema), deleteTransaction);

export default router;
