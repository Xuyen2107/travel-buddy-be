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
      enum: [1, 2], // 1: Chờ xác nhận, 2: Đồng ý,
      default: 1,
   },

   sender: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
   },
});

FriendSchema.plugin(mongoosePaginate);

const FriendModel = mongoose.model("Friends", FriendSchema);

export default FriendModel;
