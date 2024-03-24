import express from "express";
const usersRouter = express.Router();

import * as usersController from "./users.controller.js";

usersRouter.get("/", usersController.getAllUsers);
usersRouter.post("/", usersController.createUser);
usersRouter.get("/:userId", usersController.getUserById);
usersRouter.put("/:userId", usersController.updateUser);
usersRouter.patch(
  "/change-password/:userId",
  usersController.changeUserPassword
);
usersRouter.delete("/:userId", usersController.deleteUser);

export default usersRouter;
