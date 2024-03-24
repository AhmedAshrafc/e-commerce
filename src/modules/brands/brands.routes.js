import express from "express";
const brandsRouter = express.Router();

import * as brandsController from "./brands.controller.js";

import { validation } from "../../utils/middleware/validation.js";
import { createBrandSchema, updateBrandSchema } from "./brands.validation.js";
import { uploadSingleFile } from "../../utils/middleware/fileUpload.js";

brandsRouter.get("/", brandsController.getAllBrands);
brandsRouter.post(
  "/",
  uploadSingleFile("brands", "logo"),
  validation(createBrandSchema),
  brandsController.createBrand
);
brandsRouter.get("/:brandId", brandsController.getBrandById);
brandsRouter.put(
  "/:brandId",
  uploadSingleFile("brands", "logo"),
  validation(updateBrandSchema),
  brandsController.updateBrand
);
brandsRouter.delete("/:brandId", brandsController.deleteBrand);

export default brandsRouter;
