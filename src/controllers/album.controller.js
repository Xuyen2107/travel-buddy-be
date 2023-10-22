import asyncHandler from "express-async-handler";
import AlbumModel from "../models/albumModel.js";
import UserModel from "../models/userModel.js";

const albumController = {
   //[Get] /album
   index: async (req, res) => {
      res.json({
         message: "Test Api [Get] /api/v1/album",
      });
   },

   //[Post]
   // create a new album

   createAlbum: asyncHandler(async (req, res) => {
      const { nameAlbum, avatarAlbum, isPublic, images } = req.body;
      const userId = req.user.id;
      const avatarUser = await UserModel.findById(userId).select("avatar");

      const newAlbum = new AlbumModel({
         author: userId,
         nameAlbum,
         avatarAlbum: avatarUser,
         isPublic,
         images,
      });

      await newAlbum.save();

      res.status(200).json({
         data: newAlbum,
      });
   }),

   //[Get] /album/:id
   //get a album
   getSingleAlbum: asyncHandler(async (req, res) => {
      const albumId = req.params.id;

      const album = await AlbumModel.findById(albumId);

      res.status(200).json({ data: album });
   }),

   //[Get] /album/owners/:id
   //Get all album owners

   getAllOwnersAlbum: asyncHandler(async (req, res) => {
      const userId = req.user.id;

      const album = await AlbumModel.find({ author: userId });

      if (!album) {
         return res
        .status(404)
        .json("Không tìm thấy bất kỳ bài viết nào của user");
      }
      res.status(201).json({ data: album });
   }),

   //[Put] /album/:id
   //Update a album

   updateAlbum: asyncHandler(async (req, res) => {
      const albumId = req.params.id;
      const { nameAlbum, avatarAlbum, isPublic, images } = req.body;

      const userId = req.user.id;

      const updateAlbum = await AlbumModel.findByIdAndUpdate(
         albumId,
         {
            author: userId,
            avatarAlbum,
            isPublic,
            images,
            nameAlbum,
         },
         { new: true }
      );

      if (!updateAlbum) {
         return res.status(404).json({ message: "bài album không tồn tại" });
      }
      res.status(200).json({ data: updateAlbum });
   }),

   //[Delete] /album/:id
   //delete a album

   removeAlbum: asyncHandler(async (req, res) => {
      const albumId = req.params.id;

      const deleteAlbum = await AlbumModel.findByIdAndDelete(albumId);

      if (!deleteAlbum) {
         return res.status(404).json({ message: "bài album không tồn tại" });
      }

      res.status(200).json({ message: "Bài album đã được xóa thành công" });
   }),
};

export default albumController;
