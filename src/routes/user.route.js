import express from "express";
import UserController from "../controllers/user.controller.js";
import uploadFile from "../configs/multer.config.js";
import paramValidation from "../validations/params.validate.js";
import validationMiddleware from "../middlewares/validation.middleware.js";
import userValidation from "../validations/user.validation.js";

const userRoute = express.Router();

userRoute.put("/upload-avatar", uploadFile.single("avatar"), UserController.uploadAvatar);
userRoute.put("/update", validationMiddleware, UserController.updateUser);
userRoute.get("/profile/:userId", paramValidation("userId"), validationMiddleware, UserController.getUser);
userRoute.get("/friend/:userId", paramValidation("userId"), validationMiddleware, UserController.getSingleFriend);
userRoute.get("/friends/:userId", paramValidation("userId"), validationMiddleware, UserController.getFriendsUser);
userRoute.get("/friends-send/:userId", paramValidation("userId"), validationMiddleware, UserController.getFriendsSend);
userRoute.put(
   "/update-password/:userId",
   paramValidation("userId"),
   userValidation("updatePassword"),
   validationMiddleware,
   UserController.updatePassword,
);
userRoute.post("/send-friend/:userId", paramValidation("userId"), validationMiddleware, UserController.sendFriendRequest);
userRoute.put("/accept-friend/:userId", paramValidation("userId"), validationMiddleware, UserController.acceptFriendRequest);
userRoute.put("/remove-friend/:userId", paramValidation("userId"), validationMiddleware, UserController.removeFriend);
userRoute.get("/search-user", UserController.searchUser);

export default userRoute;
