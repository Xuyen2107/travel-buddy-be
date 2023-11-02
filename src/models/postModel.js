import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
   {
      author: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Users",
         required: true,
      },

      vacation: {
         type: String,
         required: true,
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
         required: true,
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
