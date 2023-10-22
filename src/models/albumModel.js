import mongoose from "mongoose";

const AlbumSchema = new mongoose.Schema({
   author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
   },

   nameAlbum: {
      type: String,
      required: true,
   },

   avatarAlbum: {
      type: String,
      required: true,
   },

   isPublic: {
      type: Boolean,
      default: false,
   },

   images: {
      type: Array,
   },

   createAt: {
      type: Date,
      default: new Date(),
   },

   updateAt: {
      type: Date,
   },
});

AlbumSchema.pre("save", function (next) {
   this.updateAt = new Date();
   next();
});

const AlbumModel = mongoose.model("Albums", AlbumSchema);

export default AlbumModel;
