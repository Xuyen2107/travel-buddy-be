import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const AlbumSchema = new mongoose.Schema(
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

      nameAlbum: {
         type: String,
         required: true,
      },

      avatarAlbum: {
         type: String,
      },

      isPublic: {
         type: String,
         required: true,
      },

      images: {
         type: Array,
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

AlbumSchema.plugin(mongoosePaginate);

const AlbumModel = mongoose.model("Albums", AlbumSchema);

AlbumModel.paginate().then({});

export default AlbumModel;
