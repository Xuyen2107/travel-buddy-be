import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const ReplyCommentSchema = new mongoose.Schema(
   {
      author: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Users",
         required: true,
      },

      commentId: {
         type: mongoose.Schema.Types.ObjectId,
         required: true,
      },

      replyUser: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Users",
      },

      commentContent: {
         type: String,
         required: true,
      },
   },

   { timestamps: true },
);

ReplyCommentSchema.plugin(mongoosePaginate);

const ReplyCommentModel = mongoose.model("ReplyComment", ReplyCommentSchema);

ReplyCommentModel.paginate().then({});

export default ReplyCommentModel;
