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
      const data = JSON.parse(req.body.data);
      console.log(req.body.data);

      const vacationUrl = await uploadImage(file);

      const vacation = await VacationModel.create({
         author: userId,
         avatarVacation: vacationUrl,
         ...data,
      });

      res.status(200).json(vacation);
   }),

   getSingleVacation: asyncHandler(async (req, res) => {
      const { vacationId } = req.params;

      const vacation = await VacationModel.findById(vacationId).populate({
         path: "author",
         select: "fullName avatar",
      });

      if (!vacation) {
         throw new BadRequestError(vacationMessages.notFound);
      }

      res.status(200).json(vacation);
   }),

   getAllVacations: asyncHandler(async (req, res) => {
      const page = req.query.page;

      const options = {
         page,
         limit: 20,
         sort: { createdAt: -1 },
         populate: {
            path: "author",
            select: "fullName avatar",
         },
      };

      const allVacations = await VacationModel.paginate({}, options);

      res.status(200).json(allVacations.docs);
   }),

   getAllVacationsByUser: asyncHandler(async (req, res) => {
      const { userId } = req.user;
      const page = req.query.page;

      const options = {
         page,
         limit: 10,
         sort: { createAt: -1 },
         populate: {
            path: "author",
            select: "fullName avatar",
         },
      };

      const allVacationsUser = await VacationModel.paginate({ author: userId }, options);

      res.status(200).json(allVacationsUser.docs);
   }),

   getVacationsHaveUser: asyncHandler(async (req, res, next) => {
      const { userId } = req.user;

      const vacations = await VacationModel.find({
         $or: [{ author: userId }, { listUser: userId }],
      });

      if (vacations.length === 0) {
         return res.status(404).json({ message: "Không có kỳ nghỉ nào được tìm thấy" });
      }

      res.status(200).json(vacations);
   }),

   updateVacation: asyncHandler(async (req, res) => {
      const { userId } = req.user;
      const { vacationId } = req.params;
      const file = req.file;
      const data = JSON.parse(req.body.data);

      const vacation = await VacationModel.findById(vacationId);

      if (vacation.author._id.toString() !== userId) {
         throw new BadRequestError(vacationMessages.notAccept);
      }

      if (!data.avatarVacation && !file) {
         throw new BadRequestError(vacationMessages.avatarVacation.notEmpty);
      }

      if (file) {
         const vacationUrl = await uploadImage(file);
         data.avatarVacation = vacationUrl;
      }
      await vacation.updateOne(data);
      // await vacation.save();

      res.status(200).json(vacation);
   }),

   removeVacation: asyncHandler(async (req, res) => {
      const { userId } = req.user;
      const { vacationId } = req.params;

      const vacation = await VacationModel.findById(vacationId);

      if (vacation.author._id !== userId) {
         throw new BadRequestError(vacationMessages.notAccept);
      }

      await VacationModel.deleteOne(vacation);

      res.status(200).json({
         message: vacationMessages.successfully,
      });
   }),

   likeVacation: asyncHandler(async (req, res) => {
      const { vacationId } = req.params;
      const { userId } = req.user;

      const vacation = await VacationModel.findById(vacationId).populate({
         path: "author",
         select: "fullName avatar",
      });

      if (!vacation) {
         throw new BadRequestError(postMessage.notFound);
      }

      if (vacation.likes.includes(userId)) {
         vacation.likes.pull(userId);
      } else {
         vacation.likes.push(userId);
      }

      await vacation.save();

      res.status(200).json(vacation);
   }),
};

export default VacationController;
