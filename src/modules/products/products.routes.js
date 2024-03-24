import express from "express";
const productsRouter = express.Router();

import * as productsController from "./products.controller.js";
import { uploadMultipleFiles } from "../../utils/middleware/fileUpload.js";
import { allowTo, protectedRoutes } from "../auth/auth.controller.js";

productsRouter.get("/", productsController.getAllProducts);
productsRouter.post(
  "/",
  protectedRoutes,
  allowTo("admin"),
  uploadMultipleFiles("products", [
    { name: "imgCover", maxCount: 1 },
    { name: "images", maxCount: 8 },
  ]),
  productsController.createProduct
);
productsRouter.get("/:productId", productsController.getProductById);
productsRouter.put("/:productId", productsController.updateProduct);
productsRouter.delete("/:productId", productsController.deleteProduct);

export default productsRouter;
