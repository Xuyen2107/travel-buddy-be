import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
   {
      author: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Users",
      },

      vacation: {
         type: String,
      },

      milestones: {
         time: {
            type: String,
            required: true,
         },
         description: {
            type: String,
            required: true,
         },
      },

      content: {
         type: String,
         required: true,
      },

      images: {
         type: Array,
      },

      isPublic: {
         type: String,
      },

      likes: [
         {
            author: {
               type: mongoose.Schema.Types.ObjectId,
               ref: "Users",
            },
         },
      ],
   },

   { timestamps: true },
);

const PostModel = mongoose.model("Posts", PostSchema);

export default PostModel;
