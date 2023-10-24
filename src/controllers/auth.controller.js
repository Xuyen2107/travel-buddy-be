import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import UserModel from "../models/userModel.js";
import UserError from "../utils/userError.js";

const AuthController = {
   login: asyncHandler(async (req, res) => {
      const { loginInfo, password } = req.body;

      const existingUser = await UserModel.findOne({
         $or: [{ email: loginInfo }, { phoneNumber: loginInfo }, { userName: loginInfo }],
      });

      if (!existingUser) {
         throw new UserError(404, "Tài khoản chưa được đăng kí");
      }

      const isMatchPassword = await bcrypt.compare(password, existingUser.password);

      if (!isMatchPassword) {
         throw new UserError(400, "Mật khẩu nhập chưa đúng");
      }

      const jwtPayload = {
         id: existingUser.id,
      };

      const token = jwt.sign(jwtPayload, process.env.SECRET_KEY, {
         expiresIn: "72h",
      });

      res.status(200).json({
         accessToken: token,
      });
   }),

   register: asyncHandler(async (req, res) => {
      const { fullName, userName, email, phoneNumber, password, rePassword } = req.body;

      const [existingUserName, existingEmail, existingPhoneNumber] = await Promise.all([
         UserModel.findOne({ userName }),
         UserModel.findOne({ email }),
         UserModel.findOne({ phoneNumber }),
      ]);

      if (existingUserName) {
         throw new UserError(409, "Tên đăng nhâập đã tồn tại");
      }

      if (existingEmail) {
         throw new UserError(409, "Email đã tồn tại");
      }

      if (existingPhoneNumber) {
         throw new UserError(409, "Số điện thoại đã tồn tại");
      }

      if (rePassword !== password) {
         throw new UserError(400, "Mật khẩu nhập lại chưa đúng");
      }

      const newUser = new UserModel({
         fullName,
         userName,
         email,
         phoneNumber,
         password,
      });

      await newUser.save();

      res.status(200).json({
         message: "Đăng ký thành công",
      });
   }),

   profile: asyncHandler(async (req, res) => {
      const userId = req.user.id;

      const currentUser = await UserModel.findById(userId).select("-password");

      res.status(200).json({
         userInfo: currentUser,
      });
   }),
};

export default AuthController;
