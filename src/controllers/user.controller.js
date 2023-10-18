import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import nodemailer from "nodemailer";
import randomstring from "randomstring";
import UserModel from "../models/userModel.js";

const transporter = nodemailer.createTransport({
   service: "Gmail",
   auth: {
      user: "travelbuddy2107@gmail.com",
      pass: "Meloetta123",
   },
});

const otpCache = new Map();

const UserController = {
   getUser: asyncHandler(async (req, res) => {
      const userId = req.params.id;

      const user = await UserModel.findById(userId).select("-password");

      if (!user) {
         res.status(404).json({
            message: "Không tìm thấy người dùng",
         });
      }

      return res.status(200).json({
         data: user,
      });
   }),

   updateUser: asyncHandler(async (req, res) => {
      const userId = req.params.id;
      const { id } = req.user;
      const body = req.body;

      if (userId !== id) {
         return res.status(403).json({
            message: "Bạn chỉ được cập nhật thông tin của bạn",
         });
      }

      body.updateAt = new Date();

      const newUser = await UserModel.findByIdAndUpdate(
         userId,
         {
            $set: body,
         },
         { new: true }
      ).select("-password");

      res.status(200).json({
         message: " Cập nhật thành công",
         userUpdate: newUser,
      });
   }),

   uploadAvatar: asyncHandler(async (req, res) => {
      const { id } = req.user;
      const file = req.file;
      const userId = req.params.id;

      if (userId !== id) {
         return res.status(403).json({
            message: "Bạn chỉ được cập nhật avatar của bạn",
         });
      }

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

      const updateUser = await UserModel.findOneAndUpdate(
         { _id: userId },
         {
            avatar: avatarUrl,
            updateAt: Date.now(),
         },
         { new: true }
      ).select("-password");

      res.status(200).json({
         message: "Cập nhật ảnh đại diện thành công",
         data: updateUser,
      });
   }),

   changePassword: asyncHandler(async (req, res) => {
      const { id } = req.user;
      const userId = req.params.id;
      const { password, newPassword } = req.body;

      if (userId !== id) {
         return res.status(403).json({
            message: "Bạn chỉ được cập nhật mật khẩu của bạn",
         });
      }

      const existingUser = await UserModel.findById(userId);

      const isMatchPassword = await bcrypt.compare(password, existingUser.password);

      if (!isMatchPassword) {
         return res.status(400).json({
            message: "Mật khẩu chưa đúng",
         });
      }

      const salt = await bcrypt.genSalt(10);
      const haledPassword = await bcrypt.hash(newPassword, salt);

      await UserModel.findByIdAndUpdate(
         userId,
         {
            password: haledPassword,
            updateAt: new Date(),
         },
         { new: true }
      );

      res.status(200).json({
         message: "Cập nhật mật khẩu thành công",
      });
   }),

   forgotPassword: asyncHandler(async (req, res) => {
      const { id } = req.user;
      const userId = req.params.id;
      const { email } = req.body;

      if (userId !== id) {
         return res.status(403).json({
            message: "Bạn chỉ được cập nhật mật khẩu của bạn",
         });
      }

      if (!email) {
         return res.status(403).json({
            message: "Bạn chưa nhập email",
         });
      }

      const otp = randomstring.generate(6);

      const mailOptions = {
         from: "travelbuddy2107@gmail.com",
         to: email,
         subject: "Mã OTP đổi mật khẩu",
         text: `Mã OTP của bạn là: ${otp}`,
      };

      transporter.sendMail(mailOptions, (error) => {
         if (error) {
            return res.status(500).json({
               message: "Gửi email thất bại",
               error: error,
            });
         } else {
            otpCache.set(email, otp);
            return res.status(200).json({ message: "Mã otp đã gửi đến bạn" });
         }
      });
   }),
};

export default UserController;
