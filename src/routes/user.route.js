import express from "express";
import UserController from "../controllers/user.controller.js";
import uploadFile from "../configs/multer.config.js";
import { validationMiddleware } from "../middlewares/validate.middleware.js";
import registerSchema from "../validations/registerValidation.js";

const userRoute = express.Router();

userRoute.get("/:id", UserController.getUser);
userRoute.put("/:id", UserController.updateUser);
userRoute.post("/:id/upload-avatar", uploadFile.single("avatar"), UserController.uploadAvatar);
userRoute.put("/:id/change-password", UserController.changePassword);
userRoute.post("/:id/forgot-password", UserController.forgotPassword);

export default userRoute;
