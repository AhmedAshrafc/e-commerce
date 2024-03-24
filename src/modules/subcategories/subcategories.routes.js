import express from "express";
const subCategoriesRouter = express.Router({ mergeParams: true });

import * as subCategoriesController from "./subcategories.controller.js";

subCategoriesRouter.get("/", subCategoriesController.getAllSubCategories);
subCategoriesRouter.post("/", subCategoriesController.createSubCategory);
subCategoriesRouter.get(
  "/:subCategoryId",
  subCategoriesController.getSubCategoryById
);
subCategoriesRouter.put(
  "/:subCategoryId",
  subCategoriesController.updateSubCategory
);
subCategoriesRouter.delete(
  "/:subCategoryId",
  subCategoriesController.deleteSubCategory
);

export default subCategoriesRouter;
