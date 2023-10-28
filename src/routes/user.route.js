import express from "express";
import UserController from "../controllers/user.controller.js";
import uploadFile from "../configs/multer.config.js";
import paramValidation from "../validations/params.validate.js";
import validationMiddleware from "../middlewares/validation.middleware.js";
import userValidation from "../validations/user.validation.js";

const userRoute = express.Router();

userRoute.get("/:userId", paramValidation("userId"), validationMiddleware, UserController.getUser);
userRoute.put("/:userId/update", userValidation("updateUser"), validationMiddleware, UserController.updateUser);
userRoute.put("/:userId/upload-avatar", uploadFile.single("avatar"), UserController.uploadAvatar);
userRoute.put("/:userId/update-password", userValidation("updatePassword"), validationMiddleware, UserController.updatePassword);

export default userRoute;
