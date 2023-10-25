import express from "express";
import UserController from "../controllers/user.controller.js";
import uploadFile from "../configs/multer.config.js";

const userRoute = express.Router();

userRoute.get("/:id", UserController.getUser);
userRoute.put("/:id", UserController.updateUser);
userRoute.put("/:id/upload-avatar", uploadFile.single("avatar"), UserController.uploadAvatar);
userRoute.put("/:id/update-password", UserController.updatePassword);

export default userRoute;
