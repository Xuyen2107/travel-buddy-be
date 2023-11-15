import asyncHandler from "express-async-handler";
import AlbumModel from "../models/albumModel.js";
import { uploadImage } from "../services/uploadImage.js";
import BadRequestError from "../errors/BadRequestError.js";
import { ALBUM_MESSAGE } from "../utils/albumMessage.js";
import { check } from "express-validator";

const AlbumController = {
   validateAlbum: [
      check("avatarAlbum").custom((value, { req }) => {
         if (!req.files || !req.files.avatarAlbum) {
            throw new BadRequestError(ALBUM_MESSAGE.avatarAlbum.notEmpty);
         }

         return true;
      }),

      check("images").custom((value, { req }) => {
         if (!req.files || !req.files.images) {
            throw new BadRequestError(ALBUM_MESSAGE.images.notEmpty);
         }

         return true;
      }),

      check("data").custom((value) => {
         try {
            const data = value ? JSON.parse(value) : {};

            if (data && data.nameAlbum && data.vacation && data.isPublic) {
               return true;
            }

            throw new BadRequestError(ALBUM_MESSAGE.error);
         } catch (error) {
            throw new Error(ALBUM_MESSAGE.error);
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

      res.status(200).json(newAlbum);
   }),

   getAlbum: asyncHandler(async (req, res) => {
      const { albumId } = req.params;

      const album = await AlbumModel.findById(albumId).populate({
         path: "author",
         select: "fullName avatar",
      });

      if (!album) {
         throw new BadRequestError(ALBUM_MESSAGE.notFound);
      }

      res.status(200).json(album);
   }),

   getAllAlbums: asyncHandler(async (req, res) => {
      const page = req.query.page;

      const options = {
         page,
         limit: 10,
         sort: { createAt: -1 },
      };

      const result = await AlbumModel.paginate({}, options)

      res.status(200).json(result);
   }),

   getAllAlbumsByUser: asyncHandler(async (req, res) => {
      const { userId } = req.user;
      const page = req.query.page;

      const options = {
         page,
         limit: 10,
         sort: { createAt: -1 },
      };

      const result = await AlbumModel.paginate({ author: userId }, options);

      res.status(201).json(result);
   }),

   updateAlbum: asyncHandler(async (req, res) => {
      const { userId } = req.user;
      const albumId = req.params.albumId;
      const data = JSON.parse(req.body.data);
      const avatarAlbum = req.files.avatarAlbum[[0]];
      const images = req.files.images;

      const existingAlbum = await AlbumModel.findById(albumId);

      if (!existingAlbum) {
         throw new BadRequestError(ALBUM_MESSAGE.notFound);
      }

      if (existingAlbum.author.toString() !== userId) {
         throw new BadRequestError(ALBUM_MESSAGE.notAccept);
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

         data.images = albumUrl;
      }

      const updateAlbum = await AlbumModel.findByIdAndUpdate(
         albumId,
         {
            $set: data,
         },
         { new: true },
      );

      res.status(200).json(updateAlbum);
   }),

   removeAlbum: asyncHandler(async (req, res) => {
      const { albumId } = req.params;
      const { userId } = req.user;

      const album = await AlbumModel.findById(albumId);

      if (album.author._id !== userId) {
         throw new BadRequestError(ALBUM_MESSAGE.notAccept);
      }

      await AlbumModel.deleteOne(album);

      res.status(200).json({
         message: ALBUM_MESSAGE.successfully,
      });
   }),
};

export default AlbumController;
