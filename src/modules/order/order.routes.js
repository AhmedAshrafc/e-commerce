import express from "express";
const orderRouter = express.Router();

import * as orderController from "./order.controller.js";

import { protectedRoutes } from "../auth/auth.controller.js";

orderRouter.get("/", protectedRoutes, orderController.getOrder);
orderRouter.post("/:id", protectedRoutes, orderController.createCashOrder);
orderRouter.delete("/:id", protectedRoutes, orderController.deleteOrder);

export default orderRouter;
