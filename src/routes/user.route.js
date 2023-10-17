import express from "express";
import UserController from "../controllers/user.controller.js";
import uploadFile from "../configs/multer.config.js";

const userRoute = express.Router();

userRoute.get("/:id", UserController.getUser);
userRoute.put("/:id", UserController.updateUser);
userRoute.post("/:id/upload-avatar", uploadFile.single("avatar"), UserController.uploadAvatar);

export default userRoute;
