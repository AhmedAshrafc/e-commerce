import { userModel } from "../../../database/models/user.model.js";

// A function used to catch errors and send a response to the client INSTEAD of crashing the server and making it unresponsive!
const catchAsyncError = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      return res.status(500).json({ message: error.message });
    });
  };
};

const getAllWishlists = catchAsyncError(async (req, res, next) => {
  let allWishlists = await userModel
    .findOne({ _id: req.user._id })
    .populate("wishList");

  res.status(200).json({ allWishlists });
});

const addToWishList = catchAsyncError(async (req, res, next) => {
  let { product } = req.body;

  let addedWishlist = await userModel.findOneAndUpdate(
    req.user._id,
    {
      $addToSet: { wishList: product },
    },
    { new: true }
  );

  res.status(200).json({ message: "Added to wishlist successfully!" });
});

const removeWishlist = catchAsyncError(async (req, res, next) => {
  let { product } = req.body;

  let removedWishlist = await userModel.findOneAndUpdate(
    req.user._id,
    { $pull: { wishList: product } },
    {
      new: true,
    }
  );

  res.status(200).json({ message: "Removed from wishlist successfully!" });
});

export { removeWishlist, addToWishList, getAllWishlists };
