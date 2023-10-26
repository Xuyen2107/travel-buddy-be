import asyncHandler from "express-async-handler";
import VacationModel from "../models/vacationModel.js";

// Một dạng custom error cá nhân giúp in ra lỗi, chỉ cần truyền tham số statusCode và chuỗi message
import UserError from "../utils/userError.js";

// Function uploadFile làm code ngắn hơn
import { uploadImage } from "../services/uploadImage.js";

const VacationController = {
   createVacation: asyncHandler(async (req, res) => {
      const file = req.file;
      const { author, title, description, listUser, isPublic, startDay, endDay, milestones } = req.body;

      if (!file) {
         throw new UserError(404, "Vui lòng chọn ảnh đại diện cho kì nghỉ");
      }

      const vacationUrl = await uploadImage(file);

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
         throw new UserError(404, "Không tìm thấy kì nghỉ");
      }

      res.status(200).json({
         data: vacation,
      });
   }),

   getAllVacations: asyncHandler(async (req, res) => {
      // Lấy danh sách tất cả các kỳ nghỉ từ cơ sở dữ liệu
      const allVacations = await VacationModel.find();

      if (!allVacations) {
         throw new UserError(404, "Không có kì nghỉ nào trong hệ thống");
      }

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
         const vacationUrl = await uploadImage(file);

         body.avatarVacation = vacationUrl;
      }

      body.updateAt = new Date();

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
};

export default VacationController;
