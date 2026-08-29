import mongoose from 'mongoose';
import Transaction from '../../models/Transaction.js';
import Category from '../../models/Category.js';

export const getDashboardSummary = async (userId) => {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const [totals, categoryBreakdown, recentTransactions, categories] = await Promise.all([
    Transaction.aggregate([
      { $match: { user: userObjectId } },
      { $group: { _id: '$type', total: { $sum: '$amount' }, count: { $sum: 1 } } },
    ]),
    Transaction.aggregate([
      { $match: { user: userObjectId, type: 'expense' } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
      { $sort: { total: -1 } },
      { $limit: 6 },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'cat',
        },
      },
      { $unwind: { path: '$cat', preserveNullAndEmptyArrays: true } },
    ]),
    Transaction.find({ user: userObjectId }).populate('category', 'name color icon').sort({ date: -1 }).limit(5),
    Category.find({ user: userObjectId }),
  ]);

  let totalIncome = 0;
  let totalExpense = 0;
  let incomeCount = 0;
  let expenseCount = 0;
  for (const t of totals) {
    if (t._id === 'income') { totalIncome = t.total; incomeCount = t.count; }
    if (t._id === 'expense') { totalExpense = t.total; expenseCount = t.count; }
  }
  const balance = totalIncome - totalExpense;

  const breakdown = categoryBreakdown.map((item) => ({
    category: item.cat
      ? { _id: item.cat._id, name: item.cat.name, color: item.cat.color, icon: item.cat.icon }
      : { _id: item._id, name: 'Unknown', color: '#9CA3AF', icon: '' },
    total: item.total,
    percent: totalExpense > 0 ? Math.round((item.total / totalExpense) * 100) : 0,
  }));

  return {
    balance,
    totalIncome,
    totalExpense,
    incomeCount,
    expenseCount,
    transactionCount: incomeCount + expenseCount,
    categoriesCount: categories.length,
    breakdown,
    recentTransactions,
  };
};
