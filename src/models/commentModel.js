import mongoose from "mongoose";
import { formatDate } from "../utils/formatDate.js";

const CommentSchema = new mongoose.Schema({
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

   createAt: {
      type: String,
      default: new Date(),
   },

   updateAt: {
      type: String,
   },
});

const CommentModel = mongoose.model("Comments", CommentSchema);

export default CommentModel;
