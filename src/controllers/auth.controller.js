import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import UserModel from "../models/userModel.js";

const AuthController = {
  login: asyncHandler(async (req, res) => {
    const { loginInfo, password } = req.body;

    const existingUser = await UserModel.findOne({
      $or: [
        { email: loginInfo },
        { phoneNumber: loginInfo },
        { userName: loginInfo },
      ],
    });

    if (!existingUser) {
      return res.status(404).json({
        message: "Tài khoản chưa được đăng kí",
      });
    }

      const isMatchPassword = await bcrypt.compare(password, existingUser.password);

    if (!isMatchPassword) {
      return res.status(400).json({
        message: "Mật khẩu chưa đúng",
      });
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

    const [existingUserName, existingEmail, existingPhoneNumber] =
      await Promise.all([
        UserModel.findOne({ userName }),
        UserModel.findOne({ email }),
        UserModel.findOne({ phoneNumber }),
      ]);

    if (existingUserName) {
      return res.status(409).json({
        message: "Tên đăng nhập đã tồn tại",
      });
    }

    if (existingEmail) {
      return res.status(409).json({
        message: "Email đã tồn tại",
      });
    }

    if (existingPhoneNumber) {
      return res.status(409).json({
        message: "Số điện thoại đã tồn tại",
      });
    }

    if (rePassword !== password) {
      return res.status(400).json({
        message: "Mật khẩu nhập lại chưa đúng",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const haledPassword = await bcrypt.hash(password, salt);

      const newUser = new UserModel({
         fullName,
         userName,
         email,
         phoneNumber,
         password: haledPassword,
      });

    await newUser.save();

      res.status(200).json({
         message: "Đăng ký thành công",
      });
   }),

  profile: asyncHandler(async (req, res) => {
    const { id } = req.user;

    const currentUser = await UserModel.findById(id).select("-password");

    res.status(200).json({
      userInfo: currentUser,
    });
  }),
};

export default AuthController;
