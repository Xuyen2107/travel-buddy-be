import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
import { uploadImage } from "../services/uploadImage.js";
import BadRequestError from "../errors/BadRequestError.js";
import { userMessages } from "../utils/userMessage.js";
import UserModel from "../models/userModel.js";

const UserController = {
   getUser: asyncHandler(async (req, res) => {
      const userId = req.params.userId;

      const user = await UserModel.findById(userId).select("-password");

      if (!user) {
         throw new BadRequestError(userMessages.notEmpty);
      }

      return res.status(200).json({
         data: user,
      });
   }),

   updateUser: asyncHandler(async (req, res) => {
      const userId = req.user.userId;
      const body = req.body;

      body.updateAt = new Date();

      const newUser = await UserModel.findByIdAndUpdate(userId, { $set: body }, { new: true }).select("-password");

      res.status(200).json({
         userUpdate: newUser,
      });
   }),

   uploadAvatar: asyncHandler(async (req, res) => {
      const userId = req.user.userId;
      const file = req.file;

      if (!file) {
         throw new BadRequestError(userMessages.avatar.notEmpty);
      }

      const avatarUrl = await uploadImage(file);

      const updateUser = await UserModel.findByIdAndUpdate(userId, { avatar: avatarUrl }, { new: true }).select("-password");
      res.status(200).json({
         data: updateUser,
      });
   }),

   updatePassword: asyncHandler(async (req, res) => {
      const userId = req.user.userId;
      const { password, newPassword } = req.body;

      const user = await UserModel.findById(userId).select("password");

      const isMatchPassword = await bcrypt.compare(password, user.password);

      if (!isMatchPassword) {
         throw new BadRequestError(400, userMessages.password.passwordErr);
      }

      const salt = await bcrypt.genSalt(10);
      const haledPassword = await bcrypt.hash(newPassword, salt);

      await UserModel.findByIdAndUpdate(userId, { password: haledPassword }, { new: true });

      res.status(200).json({
         message: userMessages.successfully,
      });
   }),
};

export default UserController;
