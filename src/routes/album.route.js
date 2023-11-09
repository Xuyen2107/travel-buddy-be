import express from "express";
import uploadFile from "../configs/multer.config.js";
import AlbumController from "../controllers/album.controller.js";
import validationMiddleware from "../middlewares/validation.middleware.js";
import paramValidation from "../validations/params.validate.js";

const albumRouter = express.Router();

albumRouter.post(
   "/create",
   uploadFile.fields([{ name: "avatarAlbum", maxCount: 1 }, { name: "images" }]),
   AlbumController.validateAlbum,
   validationMiddleware,
   AlbumController.createAlbum,
);
albumRouter.get("/all", AlbumController.getAllAlbums);
albumRouter.get("/all-by-user", AlbumController.getAllAlbumsByUser);
albumRouter.get("/:albumId", paramValidation("albumId"), validationMiddleware, AlbumController.getAlbum);
albumRouter.put(
   "/:albumId/update",
   paramValidation("albumId"),
   validationMiddleware,
   uploadFile.fields([{ name: "avatarAlbum", maxCount: 1 }, { name: "images" }]),
   AlbumController.updateAlbum,
);
albumRouter.delete("/:albumId/delete", paramValidation("albumId"), validationMiddleware, AlbumController.removeAlbum);

export default albumRouter;
