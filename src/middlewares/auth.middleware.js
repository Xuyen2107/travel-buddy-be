import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
   const token = req.headers["x-access-token"];

   if (!token) {
      return res.status(400).json({
         message: "Vui lòng đăng nhập.",
      });
   }

   try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY || "Travel Buddy");

      req.user = decoded;

      next();
   } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
         return res.status(403).json({
            message: "Hết hạn đăng nhập, vui lòng đăng nhập lại.",
         });
      } else {
         return res.status(401).json({
            message: "Token không hợp lệ.",
         });
      }
   }
};
