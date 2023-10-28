import express from "express";
import uploadFile from "../configs/multer.config.js";
import AlbumController from "../controllers/album.controller.js";
import validationMiddleware from "../middlewares/validation.middleware.js";

const albumRouter = express.Router();

albumRouter.post(
   "/create",
   uploadFile.fields([{ name: "avatarAlbum" }, { name: "images" }]),
   AlbumController.albumValidation,
   validationMiddleware,
   AlbumController.createAlbum,
);
albumRouter.get("/:albumId", AlbumController.getAlbum);
albumRouter.get("/all", AlbumController.getAllAlbums);
albumRouter.get("/all-by-user", AlbumController.getAllAlbumsByUser);
albumRouter.put(
   "/:albumId/update",
   uploadFile.fields([{ name: "avatarAlbum" }, { name: "images" }]),
   AlbumController.albumValidation,
   validationMiddleware,
   AlbumController.updateAlbum,
);
albumRouter.delete("/:albumId/delete", AlbumController.removeAlbum);

export default albumRouter;
