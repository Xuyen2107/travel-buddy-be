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
  actions: {
    type: String,
    enum: ["Cập nhật", "Xóa"],
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
    default: Date.Now,
  },
  updateAt: {
    type: Date,
    default: Date.Now,
  },
});

const AlbumModel = mongoose.model("Albums", AlbumSchema);

export default AlbumModel;
