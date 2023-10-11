import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
   author: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
   },

   vacation: {
      type: String,
      required: true,
   },

   content: {
      type: String,
      required: true,
   },

   images: {
      type: Array,
      required: true,
   },

   createAt: {
      type: String,
   },

   updateAt: {
      type: String,
   },
});

const PostModel = mongoose.model("Posts", postSchema);
