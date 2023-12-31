import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const CommentSchema = new mongoose.Schema(
   {
      author: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Users",
      },

      postId: {
         type: mongoose.Schema.Types.ObjectId,
         required: true,
      },

      commentContent: {
         type: String,
         required: true,
      },

      isDeleted: {
         type: Boolean,
         default: false,
      },
   },

   { timestamps: true },
);

CommentSchema.plugin(mongoosePaginate);

const CommentModel = mongoose.model("Comments", CommentSchema);

CommentModel.paginate().then({});

export default CommentModel;
