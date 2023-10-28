import asyncHandler from "express-async-handler";
import { body } from "express-validator";
import VacationModel from "../models/vacationModel.js";
import BadRequestError from "../errors/BadRequestError.js";
import { uploadImage } from "../services/uploadImage.js";
import vacationMessages from "../utils/vacationMessage.js";

const VacationController = {
   validateVacation: () => {
      const validateVacation = [
         body("title").notEmpty().withMessage(vacationMessages.title.notEmpty),
         body("description").notEmpty().withMessage(vacationMessages.description.notEmpty),
         body("listUser").isArray().withMessage(vacationMessages.listUser.isArray),
         body("startDay").notEmpty().withMessage(vacationMessages.startDay.notEmpty),
         body("endDay").notEmpty().withMessage(vacationMessages.endDay.notEmpty),
         body("milestones").isArray().withMessage(vacationMessages.milestones.isArray).notEmpty().withMessage(vacationMessages.milestones.notEmpty),
      ];

      return validateVacation;
   },

   createVacation: asyncHandler(async (req, res) => {
      const userId = req.user.userId;
      const file = req.file;
      const { title, description, listUser, startDay, endDay, milestones } = req.body;

      if (!file) {
         throw new BadRequestError(vacationMessages.avatarVacation.notEmpty);
      }
      const vacationUrl = await uploadImage(file);

      const newVacation = await VacationModel.create({
         author: userId,
         title,
         avatarVacation: vacationUrl,
         description,
         listUser,
         isPublic,
         startDay,
         endDay,
         milestones,
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
      const body = req.body;

      if (file) {
         const vacationUrl = await uploadImage(file);

         body.avatarVacation = vacationUrl;
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
      const vacationId = req.params.vacationId;

      // Xóa kỳ nghỉ từ cơ sở dữ liệu
      await VacationModel.findByIdAndDelete(vacationId);

      res.status(200).json({
         message: vacationMessages.successfully,
      });
   }),
};

export default VacationController;
