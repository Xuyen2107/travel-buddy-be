import mongoose from "mongoose";
import { formatDate } from "../utils/formatDate.js";

const commentSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  user: {
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
  },

  updateAt: {
    type: String,
  },
});

const CommentModel = mongoose.model("Comments", commentSchema);

export default CommentModel;
