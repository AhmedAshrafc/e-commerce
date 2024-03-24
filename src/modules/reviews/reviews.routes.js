import express from "express";
const reviewsRouter = express.Router();

import * as reviewsController from "./reviews.controller.js";

import { protectedRoutes } from "../auth/auth.controller.js";

reviewsRouter.get("/", reviewsController.getAllReviews);
reviewsRouter.post("/", protectedRoutes, reviewsController.createReview);
reviewsRouter.get("/:reviewId", reviewsController.getReviewById);
reviewsRouter.put(
  "/:reviewId",
  protectedRoutes,
  reviewsController.updateReview
);
reviewsRouter.delete(
  "/:reviewId",
  protectedRoutes,
  reviewsController.deleteReview
);

export default reviewsRouter;
