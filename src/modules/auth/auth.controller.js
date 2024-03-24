import { userModel } from "../../../database/models/user.model.js";

import bcrypt from "bcrypt";
import jwt, { decode } from "jsonwebtoken";

const catchAsyncError = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      return res.status(500).json({ message: error.message });
    });
  };
};

export const signUp = catchAsyncError(async (req, res, next) => {
  let isFound = await userModel.findOne({ email: req.body.email });

  if (isFound) {
    return res.status(409).json({
      message: "Email already exists!",
    });
  }

  let user = new userModel(req.body);
  await user.save();

  res.json({ message: "User was added successfully!", user });
});

export const signIn = catchAsyncError(async (req, res, next) => {
  let { email, password } = req.body;

  let isFound = await userModel.findOne({ email });
  const match = await bcrypt.compare(password, isFound.password);

  if (isFound && match) {
    let token = jwt.sign(
      { name: isFound.name, userId: isFound._id, role: isFound.role },
      "shhhhh"
    );
    return res.json({ message: "success", token });
  } else {
    return res.status(401).json({
      message: "Incorrect email or password!",
    });
  }
});

// Add this function on any model path as a middleware like you did in Products, check products.routes.js in the createProduct .post method!
// Add it as a middleware if you don't want the user to do something without a token, a.k.a without being logged in.
export const protectedRoutes = catchAsyncError(async (req, res, next) => {
  // Step 1: Verify if there is a token in the headers in the first place or not before you create a new product!
  let { token } = req.headers;

  if (!token) {
    return res.status(401).json({
      message: "Please provide a token first! User must be logged in!",
    });
  }

  // Step 2: Verify the token!
  let decoded = await jwt.verify(token, "shhhhh");

  // Step 3: Check if the user that owns this token exists or not (the user might was deleted)
  let user = await userModel.findById(decoded.userId);

  if (!user) {
    return res.json({
      message: "Sorry! User was recently deleted! Token is not valid anymore!",
    });
  }

  if (user.changePasswordAt) {
    // Step 4: Check if the token is the LATEST (user might've changed their password)
    let changePasswordTime = parseInt(user.changePasswordAt.getTime() / 1000);
    if (changePasswordTime > decoded.iat) {
      return res.json({
        message:
          "Token is no longer valid! User might've recently changed their password! Re-login to solve this issue!",
      });
    }
  }

  req.user = user;

  next();
});

// Authorization. To determine if they are user or admin role.
// For example, only Admins are allowed to create a new product but not users...
export const allowTo = (...roles) => {
  return catchAsyncError((req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Sorry! You are not authorized to do such action!",
      });
    }

    next();
  });
};
