import User from '../../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  generateAccessToken,
  generateRefreshToken,
  hashRefreshToken,
} from '../../utils/tokenUtils.js';

export const getAllUsers = async () => {
  return await User.find({}).select('-password -refreshTokens');
};

export const getUserById = async (id) => {
  const user = await User.findById(id).select('-password -refreshTokens');
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

export const registerUser = async (data) => {
  const user = await createUser(data);
  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);
  await storeRefreshToken(user, refreshToken);
  return { user, accessToken, refreshToken };
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select('+password +refreshTokens');
  if (!user || !(await bcrypt.compare(password, user.password))) {
    const error = new Error('Invalid email or password');
    error.status = 401;
    throw error;
  }
  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);
  await storeRefreshToken(user, refreshToken);
  return { user, accessToken, refreshToken };
};

const MAX_REFRESH_TOKENS = 5;
const storeRefreshToken = async (user, refreshToken) => {
  user.refreshTokens.push(hashRefreshToken(refreshToken));
  // Keep only the most recent tokens (prevent unbounded growth)
  if (user.refreshTokens.length > MAX_REFRESH_TOKENS) {
    user.refreshTokens = user.refreshTokens.slice(-MAX_REFRESH_TOKENS);
  }
  await user.save();
};

export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    const error = new Error('No refresh token provided');
    error.status = 401;
    throw error;
  }
  let payload;
  try {
    payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    const error = new Error('Invalid refresh token');
    error.status = 401;
    throw error;
  }
  const user = await User.findById(payload.id).select('+refreshTokens');
  if (!user) {
    const error = new Error('User not found');
    error.status = 401;
    throw error;
  }
  const hashed = hashRefreshToken(refreshToken);
  if (!user.refreshTokens.includes(hashed)) {
    const error = new Error('Refresh token not recognized');
    error.status = 401;
    throw error;
  }
  user.refreshTokens = user.refreshTokens.filter((t) => t !== hashed);
  const newAccessToken = generateAccessToken(user.id);
  const newRefreshToken = generateRefreshToken(user.id);
  user.refreshTokens.push(hashRefreshToken(newRefreshToken));
  await user.save();
  return { user, accessToken: newAccessToken, refreshToken: newRefreshToken };
};

export const logoutUser = async (refreshToken) => {
  if (!refreshToken) return;
  const hashed = hashRefreshToken(refreshToken);
  await User.updateOne(
    { refreshTokens: hashed },
    { $pull: { refreshTokens: hashed } }
  );
};
