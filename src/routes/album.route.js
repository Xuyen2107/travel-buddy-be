import express from "express";
import albumController from "../controllers/album.controller.js";

const albumRouter = express.Router();

albumRouter.get("/", albumController.index);
albumRouter.post("/create", albumController.createAlbum);
albumRouter.get("/:id", albumController.getAlbum);
albumRouter.get("/all/", albumController.getAllAlbums);
albumRouter.put("/:id/update", albumController.updateAlbum);
albumRouter.delete("/:id/delete", albumController.removeAlbum);

export default albumRouter;
