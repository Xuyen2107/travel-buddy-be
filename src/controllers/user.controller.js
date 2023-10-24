import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
import UserModel from "../models/userModel.js";
import UserError from "../utils/userError.js";
import { uploadImage } from "../services/uploadImage.js";

const UserController = {
   getUser: asyncHandler(async (req, res) => {
      const userId = req.params.id;

      const user = await UserModel.findById(userId).select("-password");

      if (!user) {
         throw new UserError(404, "Không tìm thấy người dùng");
      }

      return res.status(200).json({
         data: user,
      });
   }),

   updateUser: asyncHandler(async (req, res) => {
      const { id } = req.user;
      const body = req.body;

      const newUser = await UserModel.findByIdAndUpdate(
         id,
         {
            $set: body,
         },
         { new: true },
      ).select("-password");

      res.status(200).json({
         userUpdate: newUser,
      });
   }),

   uploadAvatar: asyncHandler(async (req, res) => {
      const { id } = req.user;
      const file = req.file;

      if (!file) {
         throw new UserError(404, "Bạn chưa chọn ảnh");
      }

      const avatarUrl = await uploadImage(file);

      const updateUser = await UserModel.findByIdAndUpdate(
         id,
         {
            avatar: avatarUrl,
         },
         { new: true },
      ).select("-password");

      res.status(200).json({
         data: updateUser,
      });
   }),

   updatePassword: asyncHandler(async (req, res) => {
      const { id } = req.user;
      const { password, newPassword } = req.body;

      const existingUser = await UserModel.findById(id).select("password");

      const isMatchPassword = await bcrypt.compare(password, existingUser.password);

      if (!isMatchPassword) {
         throw new UserError(400, "Mật khẩu chưa đúng");
      }

      const salt = await bcrypt.genSalt(10);
      const haledPassword = await bcrypt.hash(newPassword, salt);

      await UserModel.findByIdAndUpdate(
         id,
         {
            password: haledPassword,
         },
         { new: true },
      );

      res.status(200).json({
         message: "Cập nhật mật khẩu thành công",
      });
   }),
};

export default UserController;
