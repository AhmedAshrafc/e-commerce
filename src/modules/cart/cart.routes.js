import express from "express";
const cartRouter = express.Router();

import * as cartController from "./cart.controller.js";

import { protectedRoutes } from "../auth/auth.controller.js";

cartRouter.get("/", protectedRoutes, cartController.getCart);
cartRouter.post("/", protectedRoutes, cartController.addToCart);
cartRouter.delete("/:id", protectedRoutes, cartController.removeCartItem);

export default cartRouter;
