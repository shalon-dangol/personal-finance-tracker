import Transaction from '../../models/Transaction.js';

export const getAllTransactions = async () => {
  return await Transaction.find({}).sort({ date: -1 });
};

export const getTransactionById = async (id) => {
  const transaction = await Transaction.findById(id);
  if (!transaction) {
    const error = new Error('Transaction not found');
    error.status = 404;
    throw error;
  }
  return transaction;
};

export const createTransaction = async (data) => {
  return await Transaction.create(data);
};

export const updateTransaction = async (id, data) => {
  const transaction = await Transaction.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!transaction) {
    const error = new Error('Transaction not found');
    error.status = 404;
    throw error;
  }
  return transaction;
};

export const deleteTransaction = async (id) => {
  const transaction = await Transaction.findByIdAndDelete(id);
  if (!transaction) {
    const error = new Error('Transaction not found');
    error.status = 404;
    throw error;
  }
  return transaction;
};
