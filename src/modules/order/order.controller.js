import { cartModel } from "../../../database/models/cart.model.js";
import { orderModel } from "../../../database/models/order.model.js";
import { productModel } from "../../../database/models/product.model.js";

// A function used to catch errors and send a response to the client INSTEAD of crashing the server and making it unresponsive!
const catchAsyncError = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      return res.status(500).json({ message: error.message });
    });
  };
};

const createCashOrder = catchAsyncError(async (req, res, next) => {
  let cart = await cartModel.findById(req.params.id);

  let totalOrderPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalPrice;

  let order = new orderModel({
    user: req.user._id,
    cartItems: cart.cartItems,
    totalOrderPrice,
    shippingAddress: req.body.shippingAddress,
  });

  if (order) {
    let options = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: item.quantity } },
      },
    }));

    await productModel.bulkWrite(options);
    await order.save();
  } else {
    return res.status(400).json({ message: "Order was not created" });
  }

  await cartModel.findByIdAndDelete(req.params.id);

  res.json({
    message: "Order created successfully",
    order,
  });
});

const getOrder = catchAsyncError(async (req, res, next) => {
  let order = await orderModel
    .findOne({ user: req.user._id })
    .populate("cartItems.product");

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.json({
    message: "Order found successfully",
    order,
  });
});

const getAllOrders = catchAsyncError(async (req, res, next) => {
  let orders = await orderModel.find({ user: req.user._id });

  if (!orders) {
    return res.status(404).json({ message: "No orders was found" });
  }

  res.json({
    message: "Orders found successfully",
    orders,
  });
});

const deleteOrder = catchAsyncError(async (req, res, next) => {
  let order = await orderModel.findByIdAndDelete(req.params.id);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.json({
    message: "Order deleted successfully",
  });
});

export { createCashOrder, getOrder, getAllOrders, deleteOrder };
