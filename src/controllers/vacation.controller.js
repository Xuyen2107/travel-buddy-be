import asyncHandler from "express-async-handler";
import { check } from "express-validator";
import VacationModel from "../models/vacationModel.js";
import BadRequestError from "../errors/BadRequestError.js";
import { uploadImage } from "../services/uploadImage.js";
import vacationMessages from "../utils/vacationMessage.js";

const VacationController = {
   validateVacation: [
      check("avatarVacation").custom((value, { req }) => {
         if (!req.file) {
            throw new BadRequestError(vacationMessages.avatarVacation.notEmpty);
         }

         return true;
      }),

      check("data").custom((value) => {
         try {
            const data = value ? JSON.parse(value) : null;

            if (
               data.title &&
               data.description &&
               data.isPublic &&
               data.startDay &&
               data.endDay &&
               data.milestones &&
               Array.isArray(data.milestones) &&
               data.milestones.every((milestone) => milestone.time && milestone.description)
            ) {
               return true;
            }

            throw new BadRequestError(vacationMessages.error);
         } catch (error) {
            throw new Error(vacationMessages.error);
         }
      }),
   ],

   createVacation: asyncHandler(async (req, res) => {
      const { userId } = req.user;
      const file = req.file;
      const data = jSON.parse(req.body.data);

      const vacationUrl = await uploadImage(file);

      const newVacation = await VacationModel.create({
         author: userId,
         avatarVacation: vacationUrl,
         ...data,
      });

      res.status(200).json({
         data: newVacation,
      });
   }),

   getVacation: asyncHandler(async (req, res) => {
      const vacationId = req.params.vacationId;

      const vacation = await VacationModel.findById(vacationId);

      if (!vacation) {
         throw new BadRequestError(vacationMessages.notFound);
      }

      res.status(200).json({
         data: vacation,
      });
   }),

   getAllVacations: asyncHandler(async (req, res) => {
      // Lấy danh sách tất cả các kỳ nghỉ từ cơ sở dữ liệu
      const allVacations = await VacationModel.find();

      if (!allVacations) {
         throw new BadRequestError(vacationMessages.notFound);
      }

      // Trả về danh sách kỳ nghỉ dưới dạng JSON
      res.status(200).json({
         data: allVacations,
      });
   }),

   updateVacation: asyncHandler(async (req, res) => {
      const vacationId = req.params.vacationId;
      const file = req.file;
      const data = req.body.data;

      if (file) {
         const vacationUrl = await uploadImage(file);

         data.avatarVacation = vacationUrl;
      }

      // Cập nhật thông tin kỳ nghỉ trong cơ sở dữ liệu
      const updatedVacation = await VacationModel.findByIdAndUpdate(
         vacationId,
         {
            $set: data,
         },
         { new: true }, // Trả về bản ghi sau khi đã cập nhật
      );

      res.status(200).json({
         data: updatedVacation,
      });
   }),

   removeVacation: asyncHandler(async (req, res) => {
      const vacationId = req.params.vacationId;

      // Xóa kỳ nghỉ từ cơ sở dữ liệu
      await VacationModel.findByIdAndDelete(vacationId);

      res.status(200).json({
         message: vacationMessages.successfully,
      });
   }),
};

export default VacationController;
