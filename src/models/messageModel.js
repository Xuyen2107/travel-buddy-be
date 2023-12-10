import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const messageSchema = new mongoose.Schema(
   {
      chatId: {
         type: mongoose.Schema.Types.ObjectId,
         required: true,
      },
      senderId: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Users",
      },
      text: {
         type: String,
      },

      isRead: {
         type: Boolean,
         default: false,
      },
   },
   {
      timestamps: true,
   },
);

messageSchema.plugin(mongoosePaginate);

const MessageModel = mongoose.model("message", messageSchema);

MessageModel.paginate().then({});

export default MessageModel;
