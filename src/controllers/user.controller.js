import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import randomstring from "randomstring";
import UserModel from "../models/userModel.js";
import { sendEmail } from "../services/EmailService.js";

const UserController = {
   getUser: asyncHandler(async (req, res) => {
      const userId = req.params.id;

      const user = await UserModel.findById(userId).select("-password");

      if (!user) {
         return res.status(404).json({
            message: "Không tìm thấy người dùng",
         });
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
         return res.status(404).json({
            message: "Bạn chưa chọn ảnh",
         });
      }

      const result = await cloudinary.uploader.upload(file.path, {
         resource_type: "auto",
         folder: "Travel_Buddy",
      });

      const avatarUrl = result && result.secure_url;

      fs.unlinkSync(file.path);

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

   changePassword: asyncHandler(async (req, res) => {
      const { id } = req.user;
      const { password, newPassword } = req.body;

      const existingUser = await UserModel.findById(id).select("password");

      const isMatchPassword = await bcrypt.compare(password, existingUser.password);

      if (!isMatchPassword) {
         return res.status(400).json({
            message: "Mật khẩu chưa đúng",
         });
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

   forgotPassword: asyncHandler(async (req, res) => {
      const { email } = req.body;

      if (!email) {
         return res.status(404).json({
            message: "Bạn chưa nhập email",
         });
      }

      const otp = randomstring.generate(6);

      await sendEmail(email, otp);

      res.status(200).json({
         message: "Mã otp đã gửi đến bạn",
      });
   }),
};

export default UserController;
