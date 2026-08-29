import Category from '../../models/Category.js';

export const getAllCategories = async (userId) => {
  return await Category.find({ user: userId }).sort({ createdAt: -1 });
};

export const getCategoryById = async (id, userId) => {
  const category = await Category.findOne({ _id: id, user: userId });
  if (!category) {
    const error = new Error('Category not found');
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
  const category = await Category.findOneAndUpdate({ _id: id, user: userId }, safeData, {
    new: true,
    runValidators: true,
  });
  if (!category) {
    const error = new Error('Category not found');
    error.status = 404;
    throw error;
  }
  return category;
};

export const deleteCategory = async (id, userId) => {
  const category = await Category.findOneAndDelete({ _id: id, user: userId });
  if (!category) {
    const error = new Error('Category not found');
    error.status = 404;
    throw error;
  }
  return category;
};
