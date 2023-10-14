import mongoose from "mongoose";

const AlbumSchema = new mongoose.Schema({
   author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
   },

   nameAlbum: {
      type: String,
      require: true,
   },

   vacationName: {
      type: String,
      require: true,
   },

   avatarAlbum: {
      type: String,
   },

   isPublic: {
      type: String,
      require: true,
   },

   images: {
      type: Array,
      require: true,
   },

   createAt: {
      type: String,
   },

   updateAt: {
      type: String,
   },
});

const AlbumModel = mongoose.model("Albums", AlbumSchema);

export default AlbumModel;
