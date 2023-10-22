import asyncHandler from "express-async-handler";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import AlbumModel from "../models/albumModel.js";
import UserModel from "../models/userModel.js";

const AlbumController = {
   //[Get] /album
   index: async (req, res) => {
      res.json({
         message: "Test Api [Get] /api/v1/album",
      });
   },

   //[Post]
   // create a new album

   createAlbum: asyncHandler(async (req, res) => {
      const { nameAlbum, isPublic } = req.body;
      const userId = req.user.id;
      const file = req.file["avatarAlbum"];
      const files = req.files["images"];

      if (!file) {
         return res.status(404).json({
            message: "Bạn vui lòng chọn ảnh đại diện cho album của bạn",
         });
      }

      if (!files) {
         return res.status(404).json({
            message: "Bạn vui lòng chọn ảnh đại diện cho album của bạn",
         });
      }

      const result = await cloudinary.uploader.upload(file.path, {
         resource_type: "auto",
         folder: "Travel_Buddy",
      });

      const avatarAlbum = result && result.secure_url;
      fs.unlinkSync(file.path);

      const uploadPromises = files.map(async (item) => {
         const result = await cloudinary.uploader.upload(item.path, {
            resource_type: "auto",
            folder: "Travel_Buddy",
         });

         fs.unlinkSync(item.path);

         return result.secure_url;
      });

      const albumUrl = await Promise.all(uploadPromises);

      const newAlbum = new AlbumModel({
         author: userId,
         nameAlbum,
         avatarAlbum: avatarAlbum,
         isPublic,
         images: albumUrl,
      });

      await newAlbum.save();

      res.status(200).json({
         data: newAlbum,
      });
   }),

   //[Get] /album/:id
   //get a album
   getAlbum: asyncHandler(async (req, res) => {
      const albumId = req.params.id;

      const album = await AlbumModel.findById(albumId);

      if (!album) {
         return res.status(404).json({
            message: "Không tìm thấy album",
         });
      }

      res.status(200).json({
         data: album,
      });
   }),

   //[Get] /album/owners/:id
   //Get all album owners

   getAllAlbums: asyncHandler(async (req, res) => {
      const userId = req.user.id;

      const album = await AlbumModel.find({ author: userId });

      if (!album) {
         return res.status(404).json({
            message: "Không tìm thấy bất kỳ bài viết nào của user",
         });
      }

      res.status(201).json({
         data: album,
      });
   }),

   //[Put] /album/:id
   //Update a album

   updateAlbum: asyncHandler(async (req, res) => {
      const albumId = req.params.id;
      const body = req.body;
      const file = req.file["avatarAlbum"];
      const files = req.files["images"];

      if (file) {
         const result = await cloudinary.uploader.upload(file.path, {
            resource_type: "auto",
            folder: "Travel_Buddy",
         });

         body.avatarAlbum = result && result.secure_url;
         fs.unlinkSync(file.path);
      }

      if (files) {
         const uploadPromises = files.map(async (item) => {
            const result = await cloudinary.uploader.upload(item.path, {
               resource_type: "auto",
               folder: "Travel_Buddy",
            });

            fs.unlinkSync(item.path);

            return result.secure_url;
         });

         const albumUrl = await Promise.all(uploadPromises);

         body.images = [...body.images, albumUrl];
      }

      const updateAlbum = await AlbumModel.findByIdAndUpdate(
         albumId,
         {
            $set: body,
         },
         { new: true },
      );

      if (!updateAlbum) {
         return res.status(404).json({
            message: "bài album không tồn tại",
         });
      }
      res.status(200).json({
         data: updateAlbum,
      });
   }),

   //[Delete] /album/:id
   //delete a album

   removeAlbum: asyncHandler(async (req, res) => {
      const albumId = req.params.id;

      const deleteAlbum = await AlbumModel.findByIdAndDelete(albumId);

      if (!deleteAlbum) {
         return res.status(404).json({
            message: "bài album không tồn tại",
         });
      }

      res.status(200).json({
         message: "Bài album đã được xóa thành công",
      });
   }),
};

export default AlbumController;
