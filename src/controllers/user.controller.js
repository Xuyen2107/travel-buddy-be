import bcrypt from "bcrypt";
import UserModel from "../models/userModel.js";
import { formatDate } from "../utils/formatDate.js";

const UserController = {
   updateUser: async (req, res) => {
      const userId = req.params.id;
      const body = req.body;

      if (body.id === userId) {
         if (body.password) {
            try {
               const salt = await bcrypt.genSalt(10);
               body.password = await bcrypt.hash(body.password, salt);
            } catch (error) {
               console.log(error);
            }
         }

         body.updateAt = formatDate(new Date());

         try {
            await UserModel.findByIdAndUpdate(
               userId,
               {
                  $set: body,
               },
               { new: true }
            );
            res.status(200).json({
               message: " Cập nhật thành công",
            });
         } catch (error) {
            console.error(error);
         }
      }

      return res.status(403).json("Bạn chỉ được cập nhật thông tin của bạn");
   },

   uploadAvatar: async (req, res) =>{
      
   }
};

export default UserController;
