export const errorHandlerMiddleware = (err, req, res, next) => {
   const httpStatus = err.statusCode || 500;
   const message = err.message;

   res.status(httpStatus).json({
      message: message,
   });
};
