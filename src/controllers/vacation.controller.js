import asyncHandler from "express-async-handler";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import VacationModel from "../models/vacationModels.js";

const VacationController = {
   createVacation: asyncHandler(async (req, res) => {
      const file = req.file;

      const { author, title, description, listUser, isPublic, startDay, endDay, milestones } = req.body;

      if (!file) {
         return res.status(404).json({
            message: "Vui lòng chọn ảnh đại diện cho kì nghỉ",
         });
      }

      const result = await cloudinary.uploader.upload(file.path, {
         resource_type: "auto",
         folder: "Travel_Buddy",
      });

      const vacationUrl = result && result.secure_url;

      fs.unlinkSync(file.path);

      const newVacation = new VacationModel({
         author,
         title,
         avatarVacation: vacationUrl,
         description,
         listUser,
         isPublic,
         startDay,
         endDay,
         milestones,
      });

      await newVacation.save();

      res.status(200).json({
         data: newVacation,
      });
   }),

   getVacation: asyncHandler(async (req, res) => {
      const vacationId = req.params.id;

      const vacation = await VacationModel.findById(vacationId);

      if (!vacation) {
         return res.status(404).json({
            message: "Không tìm thấy kì nghỉ",
         });
      }

      res.status(200).json({
         data: vacation,
      });
   }),

   getAllVacations: asyncHandler(async (req, res) => {
      // Lấy danh sách tất cả các kỳ nghỉ từ cơ sở dữ liệu
      const allVacations = await VacationModel.find();

      // Trả về danh sách kỳ nghỉ dưới dạng JSON
      res.status(200).json({
         data: allVacations,
      });
   }),

   updateVacation: asyncHandler(async (req, res) => {
      const vacationId = req.params.id;
      const file = req.file;
      const body = req.body;

      if (file) {
         const result = await cloudinary.uploader.upload(file.path, {
            resource_type: "auto",
            folder: "Travel_Buddy",
         });

         body.avatarVacation = result && result.secure_url;

         fs.unlinkSync(file.path);
      }

      // Cập nhật thông tin kỳ nghỉ trong cơ sở dữ liệu
      const updatedVacation = await VacationModel.findByIdAndUpdate(
         vacationId,
         {
            $set: body,
         },
         { new: true }, // Trả về bản ghi sau khi đã cập nhật
      );

      res.status(200).json({
         data: updatedVacation,
      });
   }),

   removeVacation: asyncHandler(async (req, res) => {
      const vacationId = req.params.id;

      // Xóa kỳ nghỉ từ cơ sở dữ liệu
      await VacationModel.findByIdAndDelete(vacationId);

      res.status(200).json({
         message: "Kỳ nghỉ đã được xóa",
      });
   }),

   removeAllVacations: asyncHandler(async (req, res) => {
      // Thực hiện xóa tất cả các bản ghi trong cơ sở dữ liệu
      await VacationModel.deleteMany({}); // YourModel thay thế bằng tên model thích hợp

      return res.status(200).json({
         message: "Tất cả bản ghi đã bị xóa.",
      });
   }),
};

export default VacationController;
