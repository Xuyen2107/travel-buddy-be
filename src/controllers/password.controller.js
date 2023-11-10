import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import randomstring from "randomstring";
import UserModel from "../models/userModel.js";
import BadRequestError from "../errors/BadRequestError.js";
import OtpModel from "../models/otpModel.js";
import { sendEmail } from "../services/EmailService.js";
import { userMessages } from "../utils/userMessage.js";

const PasswordController = {
   forgotPassword: asyncHandler(async (req, res) => {
      const { email } = req.body;

      if (!email) {
         throw new BadRequestError(userMessages.email.notEmpty);
      }

      const existingUser = await UserModel.findOne({ email }).select("-password");

      if (!existingUser) {
         throw new BadRequestError(userMessages.email.notExists);
      }

      const otp = randomstring.generate(6);

      await sendEmail(email, otp);

      await OtpModel.findOneAndDelete({ email });

      const otpSend = new OtpModel({
         email: email,
         code: otp,
      });

      await otpSend.save();

      res.status(200).json({
         message: userMessages.successfully,
      });
   }),

   verifyPassword: asyncHandler(async (req, res) => {
      const { email, otp, password } = req.body;

      const existingOtp = await OtpModel.findOne({ email });

      if (!existingOtp) {
         throw new BadRequestError(userMessages.otp.notSent);
      }

      if (existingOtp.code !== otp) {
         throw new BadRequestError(userMessages.otp.wrongOtp);
      }

      const salt = await bcrypt.genSalt(10);
      const haledPassword = await bcrypt.hash(password, salt);

      await UserModel.findOneAndUpdate(
         { email },
         {
            password: haledPassword,
         },
         { new: true },
      );

      await OtpModel.findOneAndDelete({ email });

      return res.status(200).json({
         message: userMessages.successfully,
      });
   }),
};

export default PasswordController;
