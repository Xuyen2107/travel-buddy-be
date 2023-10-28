import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
   author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
   },

   vacation: {
      type: String,
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
      type: String,
   },

   checkIn: {
      type: String,
      default: "",
   },

   likes: [
      {
         author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
         },
      },
   ],

   createAt: {
      type: Date,
      default: new Date(),
   },

   updateAt: {
      type: Date,
   },
});

const PostModel = mongoose.model("Posts", PostSchema);

export default PostModel;
