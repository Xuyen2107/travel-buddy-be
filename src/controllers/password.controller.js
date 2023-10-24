import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";
import randomstring from "randomstring";
import UserModel from "../models/userModel.js";
import UserError from "../utils/userError.js";
import OtpModel from "../models/otpModel.js";
import { sendEmail } from "../services/EmailService.js";

const PasswordController = {
   forgotPassword: asyncHandler(async (req, res) => {
      const { email } = req.body;

      if (!email) {
         throw new UserError(404, "Bạn chưa nhập email");
      }

      const existingUser = await UserModel.findOne({ email }).select("-password");

      if (!existingUser) {
         throw new UserError(404, "Email chưa tồn tại trong hệ thống");
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
         message: "Mã otp đã gửi đến bạn",
         data: existingUser,
      });
   }),

   verifyPassword: asyncHandler(async (req, res) => {
      const { email, otp, newPassword } = req.body;
      if (!email) {
         throw new UserError(404, "Bạn chưa nhập email");
      }

      if (!otp) {
         throw new UserError(404, "Bạn chưa nhập otp");
      }

      if (!newPassword) {
         throw new UserError(404, "Bạn chưa nhập mật khẩu mới");
      }

      const existingOtp = await OtpModel.findOne({ email });

      if (!existingOtp) {
         throw new UserError(404, "Bạn chưa gửi otp");
      }

      if (existingOtp.code !== otp) {
         throw new UserError(404, "Otp chưa đúng");
      }

      const salt = await bcrypt.genSalt(10);
      const haledPassword = await bcrypt.hash(newPassword, salt);

      await UserModel.findOneAndUpdate(
         { email },
         {
            password: haledPassword,
         },
         { new: true },
      );

      await OtpModel.findOneAndDelete({ email });

      return res.status(200).json({
         message: "Thay đổi mật khẩu thành công",
      });
   }),
};

export default PasswordController;
