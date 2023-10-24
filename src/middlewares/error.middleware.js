import UserError from "../utils/userError.js";

export const errorHandlerMiddleware = (err, req, res, next) => {
   if (err instanceof UserError) {
      res.status(err.statusCode).json({
         message: err.message,
      });
   } else {
      res.status(500).json({
         message: err.message || "Lỗi không xác định",
         stack: err.stack,
      });
   }
};
