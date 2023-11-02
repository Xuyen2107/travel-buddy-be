import asyncHandler from "express-async-handler";
import AlbumModel from "../models/albumModel.js";
import { uploadImage } from "../services/uploadImage.js";
import BadRequestError from "../errors/BadRequestError.js";
import { albumMessage } from "../utils/albumMessage.js";
import { check } from "express-validator";
import { log } from "console";

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
            const data = value ? JSON.parse(value) : null;

            if (data && data.nameAlbum && data.vacation && data.isPublic) {
               return true;
            }

            throw new BadRequestError(albumMessage.error);
         } catch (error) {
            throw new Error(albumMessage.error);
         }
      }),
   ],

   createAlbum: asyncHandler(async (req, res) => {
      const { userId } = req.user;
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
         avatarAlbum: avatarAlbumUrl,
         images: albumUrl,
         ...data,
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
      const { userId } = req.user;

      const album = await AlbumModel.find({ author: userId });

      if (!album) {
         throw new BadRequestError(albumMessage.notFound);
      }

      res.status(201).json({
         data: album,
      });
   }),

   updateAlbum: asyncHandler(async (req, res) => {
      const { userId } = req.user;
      const albumId = req.params.albumId;
      const data = JSON.parse(req.body.data);
      const avatarAlbum = req.files.avatarAlbum[[0]];
      const images = req.files.images;

      const existingAlbum = await AlbumModel.findById(albumId);

      if (!existingAlbum) {
         throw new BadRequestError(albumMessage.notFound);
      }

      if (existingAlbum.author.toString() !== userId) {
         throw new BadRequestError(albumMessage.notUpdate);
      }

      if (avatarAlbum) {
         data.avatarAlbum = await uploadImage(avatarAlbum);
      }

      if (images) {
         const uploadPromises = images.map(async (item) => {
            const image = await uploadImage(item);

            return image;
         });

         const albumUrl = await Promise.all(uploadPromises);

         data.images.push(...albumUrl);
      }

      const updateAlbum = await AlbumModel.findByIdAndUpdate(
         albumId,
         {
            $set: data,
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
