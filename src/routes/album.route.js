import express from "express";
import uploadFile from "../configs/multer.config.js";
import albumController from "../controllers/album.controller.js";

const albumRouter = express.Router();

albumRouter.get("/", albumController.index);
albumRouter.post("/create", uploadFile.fields([{ name: "avatarAlbum" }, { name: "images" }]), albumController.createAlbum);
albumRouter.get("/:id", albumController.getAlbum);
albumRouter.get("/all/", albumController.getAllAlbums);
albumRouter.put("/:id/update", uploadFile.fields([{ name: "avatarAlbum" }, { name: "images" }]), albumController.updateAlbum);
albumRouter.delete("/:id/delete", albumController.removeAlbum);

export default albumRouter;
