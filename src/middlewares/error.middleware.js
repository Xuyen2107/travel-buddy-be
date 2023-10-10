export const errorHandleMiddleware = (err, req, res, next) => {
   const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

   res.status(statusCode).json({
      statusCode,
      message: err.message,
      stack: err.stack,
   });
};
