import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import UserModel from "../models/userModel.js";

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
      const body = req.body;

      if (body.id === userId) {
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
      }

      return res.status(403).json({
         message: "Bạn chỉ được cập nhật thông tin của bạn",
      });
   }),

   uploadAvatar: asyncHandler(async (req, res) => {
      const file = req.file;
      const userId = req.params.id;

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
};

export default UserController;
