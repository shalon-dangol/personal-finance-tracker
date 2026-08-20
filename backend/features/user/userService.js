import User from '../../models/User.js';
import bcrypt from 'bcryptjs';

export const getAllUsers = async () => {
  return await User.find({});
};

export const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    const error = new Error('User not found');
    error.status = 404;
    throw error;
  }
  return user;
};

export const createUser = async (data) => {
  const { name, email, password } = data;
  const existing = await User.findOne({ email });
  if (existing) {
    const error = new Error('User with this email already exists');
    error.status = 400;
    throw error;
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  return await User.create({ name, email, password: hashedPassword });
};
