import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  author: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  vacation: {
    type: String,
    default: "kỳ nghỉ hiện tại",
  },
  milestones: [
    {
      time: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
    },
  ],
  content: {
    type: String,
    required: true,
  },
  mediaUrls: {
    type: [String],
    default: [],
  },
  createAt: {
    type: Date,
    default: Date.Now,
  },
  updateAt: {
    type: Date,
    default: Date.Now,
  },
});

const PostModel = mongoose.model("Posts", postSchema);

export default PostModel;
