import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const FriendSchema = new mongoose.Schema({
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
   },

   friend: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
   },

   status: {
      type: Number,
      enum: [0, 1, 2], // 0: Chờ xác nhận, 1: Đồng ý, 2: Từ chối
      default: 0, // Trạng thái mặc định là "Chờ xác nhận" (0)
   },

   sender: {
      type: mongoose.Schema.ObjectId,
      required: true,
   },
});

FriendSchema.plugin(mongoosePaginate);

const FriendModel = mongoose.model("Friend", FriendSchema);

export default FriendModel;
