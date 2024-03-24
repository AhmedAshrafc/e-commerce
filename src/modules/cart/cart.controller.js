import { cartModel } from "../../../database/models/cart.model.js";
import { productModel } from "../../../database/models/product.model.js";

// A function used to catch errors and send a response to the client INSTEAD of crashing the server and making it unresponsive!
const catchAsyncError = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      return res.status(500).json({ message: error.message });
    });
  };
};

function calculatePrice(cart) {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });

  cart.totalPrice = totalPrice;
}

const addToCart = catchAsyncError(async (req, res, next) => {
  let product = await productModel.findById(req.body.product).select("price");

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  req.body.price = product.price;

  let isCartExists = await cartModel.findOne({ user: req.user._id });

  if (!isCartExists) {
    let cart = new cartModel({
      user: req.user._id,
      cartItems: [req.body],
    });

    calculatePrice(cart);

    await cart.save();

    return res.status(201).json({
      message: "Product added to cart successfully",
      cart,
    });
  }

  let item = isCartExists.cartItems.find(
    (item) => item.product == req.body.product
  );

  if (item) {
    item.quantity += 1;
  } else {
    isCartExists.cartItems.push(req.body);
  }

  calculatePrice(isCartExists);

  await isCartExists.save();

  res.json({
    message: "Product added to cart successfully",
    isCartExists,
  });
});

const getCart = catchAsyncError(async (req, res, next) => {
  let cart = await cartModel.findOne({ user: req.user._id }).populate({
    path: "cartItems.product",
    select: "name price",
  });

  res.json(cart);
});

// [TASK]: Add a getCartById function to get a cart by its ID.

const removeCartItem = catchAsyncError(async (req, res, next) => {
  let cart = await cartModel.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { cartItems: { _id: req.params.id } } },
    { new: true }
  );

  calculatePrice(cart);

  res.json({
    message: "Item removed from cart successfully",
  });
});

// [TASK]: Continue the updateCart function logic.
const updateCart = catchAsyncError(async (req, res, next) => {
  let product = await productModel.findById(req.body.product).select("price");

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  req.body.price = product.price;

  let isCartExists = await cartModel.findOne({ user: req.user._id });

  let item = isCartExists.cartItems.find(
    (item) => item.product == req.body.product
  );

  if (!item) {
    return res.status(404).json({ message: "Product not found in cart" });
  }

  if (item) {
    item.quantity = req.body.quantity;
  }

  calculatePrice(isCartExists);

  await isCartExists.save();

  res.json({
    message: "Product added to cart successfully",
    isCartExists,
  });
});

// [TASK]: Add a applyCoupon function to apply a coupon to the cart.

export { addToCart, getCart, removeCartItem, updateCart };
