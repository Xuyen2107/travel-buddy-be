import { validationResult } from "express-validator";
import BadRequestError from "../errors/BadRequestError.js";

const validationMiddleware = (req, res, next) => {
   const result = validationResult(req);

   if (!result.isEmpty()) {
      const errors = result.array({ onlyFirstError: true });

      const errorMessage = errors.map((err) => err.msg).join(", ");
      console.log(errors);

      throw new BadRequestError(errorMessage);
   }

   next();
};

export default validationMiddleware;
