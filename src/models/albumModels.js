import mongoose from "mongoose";

const AlbumSchema = new mongoose.Schema({
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

   fullName: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
   },

   status: {
      type: String,
      require: true,
   },

   albums: {
      type: Array,
      require: true,
   },
});

const AlbumModel = mongoose.model("Albums", AlbumSchema);

export default AlbumModel;
