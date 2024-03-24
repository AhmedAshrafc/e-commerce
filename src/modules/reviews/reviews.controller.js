import { reviewModel } from "../../../database/models/review.model.js";

// A function used to catch errors and send a response to the client INSTEAD of crashing the server and making it unresponsive!
const catchAsyncError = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      return res.status(500).json({ message: error.message });
    });
  };
};

const createReview = catchAsyncError(async (req, res, next) => {
  req.body.user = req.user._id;

  // Check if user has already posted a review! A user can post 1 review only per product!
  let reviewExists = await reviewModel.findOne({
    user: req.user._id,
    product: req.body.product,
  });
  if (reviewExists) {
    return res.status(409).json({
      message:
        "You've already posted a review! You can only post 1 review per product!",
    });
  }

  let newReview = await reviewModel.insertMany(req.body);

  res.status(201).json({
    message: "Review posted successfully!",
  });
});

const getAllReviews = catchAsyncError(async (req, res, next) => {
  let reviews = await reviewModel.find().populate("product");

  if (!reviews) {
    return res.status(404).json({
      message: "No reviews was found! Create a new review to get started!",
    });
  }

  res.status(200).json({ reviews });
});

const getReviewById = catchAsyncError(async (req, res, next) => {
  let { reviewId } = req.params;

  let review = await reviewModel.findById(reviewId);

  res.status(200).json({ review });
});

const updateReview = catchAsyncError(async (req, res, next) => {
  let { reviewId } = req.params;

  // [TASK]: Add some logic right here to make the user update ONLY their reviews not just any review! You can't update someone else's user! Therefore you must check if this review that is being updated yours or not.

  let updatedReview = await reviewModel.findOneAndUpdate(
    { _id: reviewId, user: req.user._id },
    req.body,
    {
      new: true,
    }
  );

  if (!updatedReview) {
    return res.status(404).json({
      message:
        "Couldn't update! This review was not posted by you! Only the owner of this review can EDIT it!",
    });
  }

  res.status(200).json({ message: "Review updated successfully!" });
});

const deleteReview = catchAsyncError(async (req, res, next) => {
  let { reviewId } = req.params;

  let deletedReview = await reviewModel.findOneAndDelete({
    _id: reviewId,
    user: req.user._id,
  });

  if (!deletedReview) {
    return res.status(404).json({
      message:
        "Couldn't delete! This review was not posted by you! Only the owner of this review can DELETE it!",
    });
  }

  res.status(200).json({ message: "Review deleted successfully!" });
});

export {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
};
