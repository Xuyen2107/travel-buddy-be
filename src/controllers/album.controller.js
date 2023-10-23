import asyncHandler from "express-async-handler";
import AlbumModel from "../models/albumModel.js";

// Function uploadFile làm code ngắn hơn, chỉ cần truyền fike đầu vào
import { uploadImage } from "../services/uploadImage.js";

// Một dạng custom error cá nhân giúp in ra lỗi, chỉ cần truyền tham số statusCode và chuỗi message
import UserError from "../utils/userError.js";

const AlbumController = {
   //[Get] /album
   index: async (req, res) => {
      res.json({
         message: "Test Api [Get] /api/v1/album",
      });
   },

   //[Post] create a new album
   createAlbum: asyncHandler(async (req, res) => {
      const userId = req.user.id;
      const { nameAlbum } = req.body;
      const file = req.files;
      const avatarAlbum = file["avatarAlbum"] === undefined ? null : file["avatarAlbum"][0];
      const images = file["images"];

      if (!avatarAlbum) {
         throw new UserError(404, "Bạn vui lòng chọn ảnh đại diện cho album của bạn");
      }

      if (!images) {
         throw new UserError(404, "Bạn vui lòng chọn ảnh cho album của bạn");
      }

      const avatarAlbumUrl = await uploadImage(avatarAlbum);

      const uploadPromises = images.map(async (item) => {
         const image = await uploadImage(item);

         return image;
      });

      const albumUrl = await Promise.all(uploadPromises);

      const newAlbum = new AlbumModel({
         author: userId,
         nameAlbum,
         avatarAlbum: avatarAlbumUrl,
         images: albumUrl,
      });

      await newAlbum.save();

      res.status(200).json({
         data: newAlbum,
      });
   }),

   //[Get] /album/:id get a album
   getAlbum: asyncHandler(async (req, res) => {
      const albumId = req.params.id;

      const album = await AlbumModel.findById(albumId);

      if (!album) {
         throw new UserError(404, "Không tìm thấy album");
      }

      res.status(200).json({
         data: album,
      });
   }),

   //[Get] /album/owners/:id Get all album owners
   getAllAlbums: asyncHandler(async (req, res) => {
      const userId = req.user.id;

      const album = await AlbumModel.find({ author: userId });

      if (!album) {
         throw new UserError(404, "Không tìm thấy bất kỳ bài viết nào của user");
      }

      res.status(201).json({
         data: album,
      });
   }),

   //[Put] /album/:id Update a album
   updateAlbum: asyncHandler(async (req, res) => {
      const albumId = req.params.id;
      const body = req.body;
      const file = req.files;
      const avatarAlbum = file["avatarAlbum"] === undefined ? null : file["avatarAlbum"][0];
      const images = file["images"];
      console.log(avatarAlbum);

      if (avatarAlbum) {
         body.avatarAlbum = await uploadImage(avatarAlbum);
      }

      if (images) {
         const uploadPromises = images.map(async (item) => {
            const image = await uploadImage(item);

            return image;
         });

         const albumUrl = await Promise.all(uploadPromises);

         body.images.push(...albumUrl);
      }

      body.updateAt = new Date();

      const updateAlbum = await AlbumModel.findByIdAndUpdate(
         albumId,
         {
            $set: body,
         },
         { new: true },
      );

      if (!updateAlbum) {
         throw new UserError(404, "Bài album không tồn tại");
      }

      res.status(200).json({
         data: updateAlbum,
      });
   }),

   //[Delete] /album/:id delete a album
   removeAlbum: asyncHandler(async (req, res) => {
      const albumId = req.params.id;

      const deleteAlbum = await AlbumModel.findByIdAndDelete(albumId);

      if (!deleteAlbum) {
         throw new UserError(404, "Bài album không tồn tại");
      }

      res.status(200).json({
         message: "Bài album đã được xóa thành công",
      });
   }),
};

export default AlbumController;
