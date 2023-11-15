import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import UserModel from "../models/userModel.js";
import BadRequestError from "../errors/BadRequestError.js";
import { userMessages } from "../utils/userMessage.js";

const AuthController = {
   register: asyncHandler(async (req, res) => {
      const { fullName, userName, email, phoneNumber, password, rePassword } = req.body;

      if (userName.toString() === password.toString()) {
         throw new BadRequestError("Username và mật khẩu phải khác nhau");
      }

      if (rePassword !== password) {
         throw new BadRequestError(userMessages.password.passwordMismatch);
      }

      const user = await UserModel.create({
         fullName,
         userName,
         email,
         phoneNumber,
         password,
      });

      const jwtPayload = {
         userId: user._id,
      };

      const token = await jwt.sign(jwtPayload, process.env.SECRET_KEY, {
         expiresIn: "72h",
      });

      res.status(200).json(token);
   }),

   login: asyncHandler(async (req, res) => {
      const { loginInfo, password } = req.body;

      const user = await UserModel.findOne({
         $or: [{ email: loginInfo }, { phoneNumber: loginInfo }, { userName: loginInfo }],
      }).select("password");

      const isMatchPassword = await bcrypt.compare(password, user.password);

      if (!isMatchPassword) {
         throw new BadRequestError(userMessages.password.passwordErr);
      }

      const jwtPayload = {
         userId: user._id,
      };

      const token = await jwt.sign(jwtPayload, process.env.SECRET_KEY, {
         expiresIn: "72h",
      });

      res.status(200).json(token);
   }),

   profile: asyncHandler(async (req, res) => {
      const { userId } = req.user;

      const currentUser = await UserModel.findById(userId).select("-password -friends");

      res.status(200).json(currentUser);
   }),
};

export default AuthController;
