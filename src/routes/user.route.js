import express from "express";
import UserController from "../controllers/user.controller.js";

const userRoute = express.Router();

userRoute.put("/:id", UserController.updateUser);

export default userRoute;
