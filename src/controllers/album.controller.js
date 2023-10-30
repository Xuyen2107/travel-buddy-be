import asyncHandler from "express-async-handler";
import AlbumModel from "../models/albumModel.js";
import { uploadImage } from "../services/uploadImage.js";
import BadRequestError from "../errors/BadRequestError.js";
import { albumMessage } from "../utils/albumMessage.js";
import { check } from "express-validator";

const AlbumController = {
   validateAlbum: [
      check("avatarAlbum").custom((value, { req }) => {
         if (!req.files || !req.files.avatarAlbum) {
            throw new BadRequestError(albumMessage.avatarAlbum.notEmpty);
         }

         return true;
      }),

      check("images").custom((value, { req }) => {
         if (!req.files || !req.files.images) {
            throw new BadRequestError(albumMessage.images.notEmpty);
         }

         return true;
      }),

      check("data").custom((value) => {
         try {
            const dataValue = value ? JSON.parse(value) : {};

            if (dataValue && dataValue.nameAlbum && dataValue.vacation && dataValue.isPublic) {
               return true;
            }

            throw new BadRequestError(albumMessage.error);
         } catch (error) {
            throw new Error(albumMessage.error);
         }
      }),
   ],

   createAlbum: asyncHandler(async (req, res) => {
      const userId = req.user.userId;
      const data = JSON.parse(req.body.data);
      const avatarAlbum = req.files.avatarAlbum[0];
      const images = req.files.images;

      const avatarAlbumUrl = await uploadImage(avatarAlbum);

      const uploadPromises = images.map(async (item) => {
         const image = await uploadImage(item);

         return image;
      });

      const albumUrl = await Promise.all(uploadPromises);

      const newAlbum = await AlbumModel.create({
         author: userId,
         nameAlbum: data.nameAlbum,
         vacation: data.vacation,
         isPublic: data.isPublic,
         avatarAlbum: avatarAlbumUrl,
         images: albumUrl,
      });

      res.status(200).json({
         data: newAlbum,
      });
   }),

   getAlbum: asyncHandler(async (req, res) => {
      const albumId = req.params.albumId;

      const album = await AlbumModel.findById(albumId);

      if (!album) {
         throw new BadRequestError(albumMessage.notFound);
      }

      res.status(200).json({
         data: album,
      });
   }),

   getAllAlbums: asyncHandler(async (req, res) => {
      const allAlbum = await AlbumModel.find();

      if (!allAlbum) {
         throw new BadRequestError(albumMessage.notFound);
      }

      res.status(200).json({
         data: allAlbum,
      });
   }),

   getAllAlbumsByUser: asyncHandler(async (req, res) => {
      const userId = req.user.userId;

      const album = await AlbumModel.find({ author: userId });

      if (!album) {
         throw new BadRequestError(albumMessage.notFound);
      }

      res.status(201).json({
         data: album,
      });
   }),

   updateAlbum: asyncHandler(async (req, res) => {
      const userId = req.user.userId;
      const albumId = req.params.albumId;
      const body = req.body;
      const avatarAlbum = req.files.avatarAlbum;
      const images = req.files.images;

      const existingAlbum = await AlbumModel.findById(albumId);

      if (!existingAlbum) {
         throw new BadRequestError(albumMessage.notFound);
      }

      if (existingAlbum.author !== userId) {
         throw new BadRequestError(albumMessage.notUpdate);
      }

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

      const updateAlbum = await AlbumModel.findByIdAndUpdate(
         albumId,
         {
            $set: body,
         },
         { new: true },
      );

      res.status(200).json({
         data: updateAlbum,
      });
   }),

   removeAlbum: asyncHandler(async (req, res) => {
      const albumId = req.params.albumId;

      const deleteAlbum = await AlbumModel.findByIdAndDelete(albumId);

      if (!deleteAlbum) {
         throw new BadRequestError(albumMessage.notFound);
      }

      res.status(200).json({
         message: albumMessage.successfully,
      });
   }),
};

export default AlbumController;
