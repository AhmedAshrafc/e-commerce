import mongoose from "mongoose";

const reviewSchema = mongoose.Schema(
  {
    comment: {
      type: String,
      trim: true,
      required: [true, "review comment required"],
    },
    product: {
      type: mongoose.Types.ObjectId,
      ref: "product",
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "user",
    },
    rating: {
      type: Number,
      min: 1,
      max: 10,
    },
  },
  { timestamps: true }
);

// Any query that starts with the word 'find', whether it's findOne, findById, etc, will populate the user field with the name field only. So you can easily access the user's name in the frontend without having to make another query to the user collection.
reviewSchema.pre(/^find/, function () {
  this.populate("user", "name");
});

export const reviewModel = mongoose.model("review", reviewSchema);
