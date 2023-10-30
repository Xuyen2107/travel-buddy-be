import { param } from "express-validator";
import mongoose from "mongoose";
import BadRequestError from "../errors/BadRequestError.js";

const paramValidation = (method) => {
   const paramValidate = [
      param(method).custom(async (value) => {
         const isValidId = await mongoose.Types.ObjectId.isValid(value);
         console.log(isValidId);
         if (!isValidId) {
            throw new BadRequestError(`${method} không hợp lệ`);
         }
      }),
   ];

   return paramValidate;
};
export default paramValidation;
