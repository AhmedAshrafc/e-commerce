import * as dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();

import dbConnection from "./database/dbConnection.js";

import cors from "cors";

import morgan from "morgan";
app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 3010;
app.use(cors());
app.use(express.static("uploads"));
app.use(express.urlencoded({ extended: true }));

dbConnection();

// ROUTERS
app.all("/", (req, res) => {
  res.json({
    message:
      "Welcome to the API! Start changing the paths to explore the API more!",
  });
});
import categoriesRouter from "./src/modules/categories/categories.routes.js";
import subCategoriesRouter from "./src/modules/subcategories/subcategories.routes.js";
import brandsRouter from "./src/modules/brands/brands.routes.js";
import productsRouter from "./src/modules/products/products.routes.js";
import usersRouter from "./src/modules/users/users.routes.js";
import authRouter from "./src/modules/auth/auth.routes.js";
import reviewsRouter from "./src/modules/reviews/reviews.routes.js";
import wishListRouter from "./src/modules/wishlist/wishlist.routes.js";
import couponsRouter from "./src/modules/coupon/coupon.routes.js";
import cartRouter from "./src/modules/cart/cart.routes.js";
import orderRouter from "./src/modules/order/order.routes.js";
app.use("/categories", categoriesRouter);
app.use("/sub-categories", subCategoriesRouter);
app.use("/brands", brandsRouter);
app.use("/products", productsRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter);
app.use("/reviews", reviewsRouter);
app.use("/wishlist", wishListRouter);
app.use("/coupons", couponsRouter);
app.use("/cart", cartRouter);
app.use("/order", orderRouter);
app.all("*", (req, res, next) => {
  res.status(404).json({ message: "Route not found!" });
});

app.listen(process.env.PORT || PORT, () =>
  console.log(`Server is running on port ${PORT}!`)
);
