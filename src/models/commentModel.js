import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const CommentSchema = new mongoose.Schema(
   {
      author: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Users",
      },

      idPost: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Posts",
         required: true,
      },

      text: {
         type: String,
         required: true,
      },
   },

   { timestamps: true },
);

CommentSchema.plugin(mongoosePaginate);

const CommentModel = mongoose.model("Comments", CommentSchema);

CommentModel.paginate().then({});

export default CommentModel;
