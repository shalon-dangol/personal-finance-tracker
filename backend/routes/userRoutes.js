import express from "express";
const router = express.Router();
import {
  registerUser,
  loginUser,
  refreshUser,
  logoutUser,
} from "../features/user/userController.js";
import { validate } from "../middleware/validate.js";
import {
  registerSchema,
  loginSchema,
} from "../features/user/userValidation.js";

// Only auth endpoints are exposed — user listing/creation was removed
// because it leaked other users' data to any authenticated user.
router.post("/register", validate(registerSchema), registerUser);
router.post("/login", validate(loginSchema), loginUser);
router.post("/refresh", refreshUser);
router.post("/logout", logoutUser);

export default router;
