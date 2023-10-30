import mongoose from "mongoose";
import { formatDate } from "../utils/formatDate.js";

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

const CommentModel = mongoose.model("Comments", CommentSchema);

export default CommentModel;
