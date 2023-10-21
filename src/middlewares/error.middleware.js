import mongoose from "mongoose";

export const errorHandlerMiddleware = (err, req, res, next) => {
   const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
   // const id = req.params.id;

   // if (!mongoose.Types.ObjectId.isValid(id)) {
   //    return res.status(404).json({
   //       message: "Id không hợp lệ",
   //    });
   // }

   res.status(statusCode).json({
      message: err.message,
      statusCode,
      stack: err.stack,
   });
};
