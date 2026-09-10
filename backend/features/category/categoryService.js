import mongoose from "mongoose";
import Category from "../../models/Category.js";
import Transaction from "../../models/Transaction.js";

export const getAllCategories = async (userId) => {
  return await Category.find({ user: userId }).sort({ createdAt: -1 });
};

export const getCategoryById = async (id, userId) => {
  const category = await Category.findOne({ _id: id, user: userId });
  if (!category) {
    const error = new Error("Category not found");
    error.status = 404;
    throw error;
  }
  return category;
};

export const createCategory = async (data, userId) => {
  return await Category.create({ ...data, user: userId });
};

export const updateCategory = async (id, data, userId) => {
  // Prevent user field from being overwritten
  const { user, _id, ...safeData } = data;
  const category = await Category.findOneAndUpdate(
    { _id: id, user: userId },
    safeData,
    {
      new: true,
      runValidators: true,
    },
  );
  if (!category) {
    const error = new Error("Category not found");
    error.status = 404;
    throw error;
  }
  return category;
};

export const deleteCategory = async (id, userId) => {
  const category = await Category.findOneAndDelete({ _id: id, user: userId });
  if (!category) {
    const error = new Error("Category not found");
    error.status = 404;
    throw error;
  }
  // Cascade: remove the category's transactions so analytics and lists
  // don't end up with dangling category references ("Unknown" entries).
  await Transaction.deleteMany({ category: id, user: userId });
  return category;
};

// Total spent per category (all-time) — used by the Categories page.
// Unlike the dashboard breakdown, this covers EVERY category (no limit).
export const getSpentTotals = async (userId) => {
  const totals = await Transaction.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        type: "expense",
      },
    },
    { $group: { _id: "$category", total: { $sum: "$amount" } } },
  ]);
  // Convert to a plain map: { categoryIdString: total }
  const spentMap = {};
  for (const t of totals) {
    spentMap[t._id.toString()] = t.total;
  }
  return spentMap;
};
