import express from "express";
const wishListRouter = express.Router();

import * as wishlistController from "./wishlist.controller.js";

import { protectedRoutes } from "../auth/auth.controller.js";

wishListRouter.patch("/", protectedRoutes, wishlistController.addToWishList);
wishListRouter.delete("/", protectedRoutes, wishlistController.removeWishlist);
wishListRouter.get("/", protectedRoutes, wishlistController.getAllWishlists);

export default wishListRouter;
