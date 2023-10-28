import asyncHandler from "express-async-handler";
import AlbumModel from "../models/albumModel.js";
import { uploadImage } from "../services/uploadImage.js";
import BadRequestError from "../errors/BadRequestError.js";
import { albumMessage } from "../utils/albumMessage.js";

const AlbumController = {
   albumValidation: () => {
      const validateAlbum = [
         body("nameAlbum").isString().notEmpty().withMessage(albumMessage.nameAlbum.notEmpty),
         body("vacation").isString().notEmpty().withMessage(albumMessage.vacation.notEmpty),
         body("isPublic").isString().notEmpty().withMessage(albumMessage.isPublic.notEmpty),
      ];

      return validateAlbum;
   },

   createAlbum: asyncHandler(async (req, res) => {
      const userId = req.user.userId;
      const { nameAlbum, vacation, isPublic } = req.body;
      const file = req.files;
      const avatarAlbum = file["avatarAlbum"] === undefined ? null : file["avatarAlbum"][0];
      const images = file["images"];

      if (!avatarAlbum) {
         throw new BadRequestError(albumMessage.avatarAlbum.notEmpty);
      }

      if (!images) {
         throw new BadRequestError(albumMessage.images.notEmpty);
      }

      const avatarAlbumUrl = await uploadImage(avatarAlbum);

      const uploadPromises = images.map(async (item) => {
         const image = await uploadImage(item);

         return image;
      });

      const albumUrl = await Promise.all(uploadPromises);

      const newAlbum = await AlbumModel.create({
         author: userId,
         nameAlbum,
         vacation,
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
      const file = req.files;
      const avatarAlbum = file["avatarAlbum"] === undefined ? null : file["avatarAlbum"][0];
      const images = file["images"];

      const existingAlbum = await AlbumModel.findById(albumId);

      if (!existingAlbum) {
         throw new BadRequestError(albumMessage.notFound);
      }

      if (existingAlbum.author !== userId) {
         throw new BadRequestError(albumMessage.error);
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
