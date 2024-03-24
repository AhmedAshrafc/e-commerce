import { couponModel } from "../../../database/models/coupon.model.js";

import QRCode from "qrcode";

// A function used to catch errors and send a response to the client INSTEAD of crashing the server and making it unresponsive!
const catchAsyncError = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      return res.status(500).json({ message: error.message });
    });
  };
};

const createCoupon = catchAsyncError(async (req, res, next) => {
  let newCoupon = await couponModel.insertMany(req.body);

  res.status(201).json({
    message: "Coupon created successfully!",
  });
});

const getAllCoupons = catchAsyncError(async (req, res, next) => {
  let coupons = await couponModel.find();

  if (!coupons) {
    return res.status(404).json({
      message: "No coupons was found! Create a new coupon to get started!",
    });
  }

  res.status(200).json({ coupons });
});

const getCouponById = catchAsyncError(async (req, res, next) => {
  let { couponId } = req.params;

  let coupon = await couponModel.findById(couponId);

  let couponQRCode = await QRCode.toDataURL(coupon.code);

  res.status(200).json({ coupon, couponQRCode });
});

const updateCoupon = catchAsyncError(async (req, res, next) => {
  let { couponId } = req.params;

  let updatedCoupon = await couponModel.findOneAndUpdate(
    { _id: couponId },
    req.body,
    {
      new: true,
    }
  );

  if (!updatedCoupon) {
    return res.status(404).json({
      message:
        "Couldn't update! This coupon was not posted by you! Only the owner of this coupon can EDIT it!",
    });
  }

  res.status(200).json({ message: "Coupon updated successfully!" });
});

const deleteCoupon = catchAsyncError(async (req, res, next) => {
  let { couponId } = req.params;

  let deletedCoupon = await couponModel.findOneAndDelete({
    _id: couponId,
  });

  if (!deletedCoupon) {
    return res.status(404).json({
      message:
        "Couldn't delete! This coupon was not posted by you! Only the owner of this coupon can DELETE it!",
    });
  }

  res.status(200).json({ message: "Coupon deleted successfully!" });
});

export {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
};
