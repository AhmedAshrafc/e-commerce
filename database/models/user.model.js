import mongoose from "mongoose";

import bcrypt from "bcrypt";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "user name required"],
      minLength: [1, "too short user name"],
    },
    email: {
      type: String,
      trim: true,
      required: [true, "email required"],
      minLength: 1,
      unique: [true, "email must be unique"],
    },
    password: {
      type: String,
      required: true,
      minLength: [6, "minLength 6 characters"],
    },
    phone: {
      type: String,
      required: [true, "phone number required"],
    },
    profilePic: String,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    changePasswordAt: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
    wishList: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
      },
    ],
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// This will be applied when: Creating a new user and signing up because both of them use .save() instead of .insertMany() or any other mongoose method...
userSchema.pre("save", function () {
  this.password = bcrypt.hashSync(this.password, 10);
});
// This will be applied when: Change user password because it uses the .findOneAndUpdate() method.
userSchema.pre("findOneAndUpdate", function () {
  this._update.password = bcrypt.hashSync(this._update.password, 10);
});

export const userModel = mongoose.model("user", userSchema);
