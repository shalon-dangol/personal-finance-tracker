import * as transactionService from './transactionService.js';

export const getTransactions = async (req, res, next) => {
  try {
    const result = await transactionService.getAllTransactions(req.user._id, req.query);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getTransactionById = async (req, res, next) => {
  try {
    const transaction = await transactionService.getTransactionById(req.params.id, req.user._id);
    res.json(transaction);
  } catch (error) {
    next(error);
  }
};

export const createTransaction = async (req, res, next) => {
  try {
    const transaction = await transactionService.createTransaction(req.body, req.user._id);
    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
};

export const updateTransaction = async (req, res, next) => {
  try {
    const transaction = await transactionService.updateTransaction(req.params.id, req.body, req.user._id);
    res.json(transaction);
  } catch (error) {
    next(error);
  }
};

export const deleteTransaction = async (req, res, next) => {
  try {
    await transactionService.deleteTransaction(req.params.id, req.user._id);
    res.json({ message: 'Transaction removed' });
  } catch (error) {
    next(error);
  }
};
