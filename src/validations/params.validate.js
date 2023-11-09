import { param } from "express-validator";

const paramValidation = (id) => {
   const paramValidate = [param(id).isMongoId().withMessage("Id không hợp lệ").bail()];

   return paramValidate;
};

export default paramValidation;
