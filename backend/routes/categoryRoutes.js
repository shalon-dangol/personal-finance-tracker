import express from "express";
const router = express.Router();
import {
  getCategories,
  getSpentTotals,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../features/category/categoryController.js";
import { protect } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdSchema,
} from "../features/category/categoryValidation.js";

router.use(protect);

router
  .route("/")
  .get(getCategories)
  .post(validate(createCategorySchema), createCategory);

// Must be declared before "/:id" so "spent" is not parsed as an id
router.get("/spent", getSpentTotals);

router
  .route("/:id")
  .get(validate(categoryIdSchema), getCategoryById)
  .put(validate(updateCategorySchema), updateCategory)
  .delete(validate(categoryIdSchema), deleteCategory);

export default router;
