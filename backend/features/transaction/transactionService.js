import mongoose from 'mongoose';
import Transaction from '../../models/Transaction.js';
import Category from '../../models/Category.js';

const assertCategoryOwnership = async (categoryId, userId) => {
  if (!categoryId) return;
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    const err = new Error('Invalid category id');
    err.status = 400;
    throw err;
  }
  const cat = await Category.findOne({ _id: categoryId, user: userId });
  if (!cat) {
    const err = new Error('Category not found or not owned by user');
    err.status = 400;
    throw err;
  }
};

export const getAllTransactions = async (userId, filters = {}) => {
  const query = { user: userId };

  if (filters.category) {
    if (!mongoose.Types.ObjectId.isValid(filters.category)) {
      // Invalid id from query — return empty rather than CastError 500
      return { transactions: [], total: 0, page: 1, limit: parseInt(filters.limit) || 20, pages: 0 };
    }
    query.category = filters.category;
  }
  if (filters.type) query.type = filters.type;
  if (filters.search) query.description = { $regex: filters.search, $options: 'i' };
  if (filters.dateFrom || filters.dateTo) {
    query.date = {};
    if (filters.dateFrom) query.date.$gte = new Date(filters.dateFrom);
    if (filters.dateTo) query.date.$lte = new Date(filters.dateTo);
  }

  const page = Math.max(1, parseInt(filters.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(filters.limit) || 20));
  const skip = (page - 1) * limit;

  const [transactions, total] = await Promise.all([
    Transaction.find(query).populate('category', 'name color icon').sort({ date: -1 }).skip(skip).limit(limit),
    Transaction.countDocuments(query),
  ]);

  return { transactions, total, page, limit, pages: Math.ceil(total / limit) };
};

export const getTransactionById = async (id, userId) => {
  const transaction = await Transaction.findOne({ _id: id, user: userId }).populate('category', 'name color icon');
  if (!transaction) {
    const error = new Error('Transaction not found');
    error.status = 404;
    throw error;
  }
  return transaction;
};

export const createTransaction = async (data, userId) => {
  await assertCategoryOwnership(data.category, userId);
  const transaction = await Transaction.create({ ...data, user: userId });
  return await transaction.populate('category', 'name color icon');
};

export const updateTransaction = async (id, data, userId) => {
  if (data.category) await assertCategoryOwnership(data.category, userId);
  const { user, _id, ...safeData } = data;
  const transaction = await Transaction.findOneAndUpdate({ _id: id, user: userId }, safeData, {
    new: true,
    runValidators: true,
  }).populate('category', 'name color icon');
  if (!transaction) {
    const error = new Error('Transaction not found');
    error.status = 404;
    throw error;
  }
  return transaction;
};

export const deleteTransaction = async (id, userId) => {
  const transaction = await Transaction.findOneAndDelete({ _id: id, user: userId });
  if (!transaction) {
    const error = new Error('Transaction not found');
    error.status = 404;
    throw error;
  }
  return transaction;
};
