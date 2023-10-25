import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
import UserModel from "../models/userModel.js";
import UserError from "../utils/userError.js";
import { uploadImage } from "../services/uploadImage.js";

const UserController = {
  getUser: asyncHandler(async (req, res) => {
    const userId = req.params.id;

    const user = await UserModel.findById(userId).select("-password");

<<<<<<< HEAD
    if (!user) {
      return res.status(404).json({
        message: "Không tìm thấy người dùng",
=======
      if (!user) {
         throw new UserError(404, "Không tìm thấy người dùng");
      }

      return res.status(200).json({
         data: user,
>>>>>>> a78df4924b233062186ad748fa2059382014ce5e
      });
    }

    return res.status(200).json({
      data: user,
    });
  }),

<<<<<<< HEAD
  updateUser: asyncHandler(async (req, res) => {
    const { id } = req.user;
    const body = req.body;

    body.updateAt = new Date();
=======
      const newUser = await UserModel.findByIdAndUpdate(
         id,
         {
            $set: body,
         },
         { new: true },
      ).select("-password");
>>>>>>> a78df4924b233062186ad748fa2059382014ce5e

    const newUser = await UserModel.findByIdAndUpdate(
      id,
      {
        $set: body,
      },
      { new: true }
    ).select("-password");

    res.status(200).json({
      userUpdate: newUser,
    });
  }),

  uploadAvatar: asyncHandler(async (req, res) => {
    const { id } = req.user;
    const file = req.file;

    if (!file) {
      return res.status(404).json({
        message: "Bạn chưa chọn ảnh",
      });
    }

    const result = await cloudinary.uploader.upload(file.path, {
      resource_type: "auto",
      folder: "Travel_Buddy",
    });

<<<<<<< HEAD
    const avatarUrl = result && result.secure_url;

    fs.unlinkSync(file.path);

    const updateUser = await UserModel.findByIdAndUpdate(
      id,
      {
        avatar: avatarUrl,
        updateAt: new Date(),
      },
      { new: true }
    ).select("-password");

    res.status(200).json({
      data: updateUser,
    });
  }),

  changePassword: asyncHandler(async (req, res) => {
    const { id } = req.user;
    const { password, newPassword } = req.body;

    const existingUser = await UserModel.findById(id).select("password");

    const isMatchPassword = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isMatchPassword) {
      return res.status(400).json({
        message: "Mật khẩu chưa đúng",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const haledPassword = await bcrypt.hash(newPassword, salt);

    await UserModel.findByIdAndUpdate(
      id,
      {
        password: haledPassword,
        updateAt: new Date(),
      },
      { new: true }
    );

    res.status(200).json({
      message: "Cập nhật mật khẩu thành công",
    });
  }),
=======
      if (!file) {
         throw new UserError(404, "Bạn chưa chọn ảnh");
      }

      const avatarUrl = await uploadImage(file);

      const updateUser = await UserModel.findByIdAndUpdate(
         id,
         {
            avatar: avatarUrl,
         },
         { new: true },
      ).select("-password");
>>>>>>> a78df4924b233062186ad748fa2059382014ce5e

  forgotPassword: asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
      return res.status(404).json({
        message: "Bạn chưa nhập email",
      });
    }

<<<<<<< HEAD
    const otp = randomstring.generate(6);
=======
   updatePassword: asyncHandler(async (req, res) => {
      const { id } = req.user;
      const { password, newPassword } = req.body;
>>>>>>> a78df4924b233062186ad748fa2059382014ce5e

    await sendEmail(email, otp);

<<<<<<< HEAD
    res.status(200).json({
      message: "Mã otp đã gửi đến bạn",
    });
  }),
=======
      const isMatchPassword = await bcrypt.compare(password, existingUser.password);

      if (!isMatchPassword) {
         throw new UserError(400, "Mật khẩu chưa đúng");
      }

      const salt = await bcrypt.genSalt(10);
      const haledPassword = await bcrypt.hash(newPassword, salt);

      await UserModel.findByIdAndUpdate(
         id,
         {
            password: haledPassword,
         },
         { new: true },
      );

      res.status(200).json({
         message: "Cập nhật mật khẩu thành công",
      });
   }),
>>>>>>> a78df4924b233062186ad748fa2059382014ce5e
};

export default UserController;
