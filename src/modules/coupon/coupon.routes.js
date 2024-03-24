import express from "express";
const couponsRouter = express.Router();

import * as couponsController from "./coupon.controller.js";

import { protectedRoutes } from "../auth/auth.controller.js";

couponsRouter.get("/", couponsController.getAllCoupons);
couponsRouter.post("/", protectedRoutes, couponsController.createCoupon);
couponsRouter.get("/:couponId", couponsController.getCouponById);
couponsRouter.put(
  "/:couponId",
  protectedRoutes,
  couponsController.updateCoupon
);
couponsRouter.delete(
  "/:couponId",
  protectedRoutes,
  couponsController.deleteCoupon
);

export default couponsRouter;
