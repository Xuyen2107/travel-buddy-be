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
         type: mongoose.Schema.Types.ObjectId,
         ref: "Vacations",
         required: true,
      },

      milestone: {
         type: mongoose.Schema.Types.ObjectId,
         required: true,
      },

      content: {
         type: String,
         required: true,
      },

      images: {
         type: Array,
      },

      isPublic: {
         type: Number,
         required: true,
         enum: ["1", "2", "3"],
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
