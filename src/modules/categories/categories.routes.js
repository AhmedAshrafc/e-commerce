import express from "express";
const router = express.Router();

import * as categoriesController from "./categories.controller.js";

import subCategoriesRouter from "../subcategories/subcategories.routes.js";

import { validation } from "../../utils/middleware/validation.js";
import {
  createCategorySchema,
  getCategoryByIdSchema,
} from "./categories.validator.js";

import { uploadSingleFile } from "../../utils/middleware/fileUpload.js";

// Just another fancy way to combine the routes that have the same path.
// router
//   .route("/")
//   .get(categoriesController.getAllCategories)
//   .post(categoriesController.createCategory);

router.use("/:categoryId/sub-categories", subCategoriesRouter);

router.get("/", categoriesController.getAllCategories);
router.post(
  "/",
  uploadSingleFile("categories", "image"),
  validation(createCategorySchema),
  categoriesController.createCategory
);
router.get(
  "/:categoryId",
  validation(getCategoryByIdSchema),
  categoriesController.getCategoryById
);
router.put("/:categoryId", categoriesController.updateCategory);
router.delete("/:categoryId", categoriesController.deleteCategory);

export default router;
