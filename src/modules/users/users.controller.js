import { userModel } from "../../../database/models/user.model.js";

import slugify from "slugify";

// A function used to catch errors and send a response to the client INSTEAD of crashing the server and making it unresponsive!
const catchAsyncError = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      return res.status(500).json({ message: error.message });
    });
  };
};

const createUser = catchAsyncError(async (req, res, next) => {
  let userExists = await userModel.findOne({ email: req.body.email });

  if (userExists) {
    return res.status(409).json({
      message: "Email already exists!",
    });
  }

  let newUser = new userModel(req.body);
  let addedUser = await newUser.save();
  // let newUser = await userModel.insertMany(req.body);

  res.status(201).json({
    message: "User created successfully!",
  });
});

const getAllUsers = catchAsyncError(async (req, res, next) => {
  let users = await userModel.find();

  if (!users) {
    return res.status(404).json({
      message: "No users was found! Create a new user to get started!",
    });
  }

  res.status(200).json({ users });
});

const getUserById = catchAsyncError(async (req, res, next) => {
  let { userId } = req.params;

  let user = await userModel.findById(userId);

  res.status(200).json({ user });
});

const updateUser = catchAsyncError(async (req, res, next) => {
  let { userId } = req.params;
  let { name } = req.body;

  let updatedUser = await userModel.findByIdAndUpdate(
    userId,
    { name, slug: slugify(name) },
    { new: true }
  );

  if (!updatedUser) {
    return res
      .status(404)
      .json({ message: "Couldn't update! User not found!" });
  }

  res.status(200).json({ message: "User updated successfully!" });
});

const deleteUser = catchAsyncError(async (req, res, next) => {
  let { userId } = req.params;

  let deletedUser = await userModel.findByIdAndDelete(userId);

  if (!deletedUser) {
    return res
      .status(404)
      .json({ message: "Couldn't delete! User not found!" });
  }

  res.status(200).json({ message: "User deleted successfully!" });
});

const changeUserPassword = catchAsyncError(async (req, res, next) => {
  let { userId } = req.params;
  req.body.changePasswordAt = Date.now();

  let userExists = await userModel.findOneAndUpdate({ _id: userId }, req.body, {
    new: true,
  });

  if (!userExists) {
    return res
      .status(404)
      .json({ message: "Couldn't update! User not found!" });
  }

  res.status(200).json({ message: "User password was updated successfully!" });
});

export {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  changeUserPassword,
};
