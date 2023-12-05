import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
   {
      chatId: {
         type: mongoose.Schema.Types.ObjectId,
      },
      senderId: {
         type: mongoose.Schema.Types.ObjectId,
      },
      text: {
         type: String,
      },
   },
   {
      timestamps: true,
   },
);

const messageModel = mongoose.model("message", messageSchema);

export default messageModel;
