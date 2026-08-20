import Category from '../../models/Category.js';

export const getAllCategories = async () => {
  return await Category.find({});
};

export const getCategoryById = async (id) => {
  const category = await Category.findById(id);
  if (!category) {
    const error = new Error('Category not found');
    error.status = 404;
    throw error;
  }
  return category;
};

export const createCategory = async (data) => {
  return await Category.create(data);
};

export const updateCategory = async (id, data) => {
  const category = await Category.findByIdAndUpdate(id, data, {
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

export const deleteCategory = async (id) => {
  const category = await Category.findByIdAndDelete(id);
  if (!category) {
    const error = new Error('Category not found');
    error.status = 404;
    throw error;
  }
  return category;
};
