import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
   author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
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
         createAt: {
            type: Date,
            default: Date.now(),
         },
      },
   ],

   shares: [
      {
         user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
         },
         createAt: {
            type: Date,
            default: Date.now(),
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

PostSchema.pre("save", function (next) {
   this.updateAt = new Date();
   next();
});

const PostModel = mongoose.model("Posts", PostSchema);

export default PostModel;
