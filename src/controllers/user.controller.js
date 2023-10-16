import bcrypt from "bcrypt";
import UserModel from "../models/userModel.js";

const UserController = {
   updateUser: async (req, res) => {
      const userId = req.params.id;
      const body = req.body;

      if (body.id === userId) {
         body.updateAt = new Date();

         try {
            await UserModel.findByIdAndUpdate(
               userId,
               {
                  $set: body,
               },
               { new: true }
            ).select("-password");

            res.status(200).json({
               message: " Cập nhật thành công",
            });
         } catch (error) {
            console.error(error);
         }
      }

      return res.status(403).json({
         message: "Bạn chỉ được cập nhật thông tin của bạn",
      });
   },

   uploadAvatar: async (req, res) => {},
};

export default UserController;
