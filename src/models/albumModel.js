import mongoose from "mongoose";

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
   },

   { timestamps: true },
);

const AlbumModel = mongoose.model("Albums", AlbumSchema);

export default AlbumModel;
