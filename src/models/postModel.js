import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

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

      likes: {
         type: [
            {
               type: mongoose.Schema.Types.ObjectId,
               ref: "Users",
            },
         ],

         default: [],
      },
   },

   { timestamps: true },
);

PostSchema.plugin(mongoosePaginate);

const PostModel = mongoose.model("Posts", PostSchema);

PostModel.paginate().then({});

export default PostModel;
