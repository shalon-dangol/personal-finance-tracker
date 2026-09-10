import * as userService from "./userService.js";

const toSafeUser = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  createdAt: user.createdAt,
});

export const registerUser = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await userService.registerUser(
      req.body,
    );
    setRefreshTokenCookie(res, refreshToken);
    res.status(201).json({ user: toSafeUser(user), accessToken });
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await userService.loginUser(
      email,
      password,
    );
    setRefreshTokenCookie(res, refreshToken);
    res.json({ user: toSafeUser(user), accessToken });
  } catch (error) {
    next(error);
  }
};

export const refreshUser = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    const {
      user,
      accessToken,
      refreshToken: newRefreshToken,
    } = await userService.refreshAccessToken(refreshToken);
    setRefreshTokenCookie(res, newRefreshToken);
    res.json({ user: toSafeUser(user), accessToken });
  } catch (error) {
    next(error);
  }
};

export const logoutUser = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    await userService.logoutUser(refreshToken);
    // Pass the same options used when setting the cookie so the browser
    // reliably removes it (path/httpOnly/sameSite/secure must match).
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};
