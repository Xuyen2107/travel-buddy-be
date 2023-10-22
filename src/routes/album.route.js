import express from "express";
import albumController from "../controllers/album.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const albumRouter = express.Router();

albumRouter.use(authMiddleware);

albumRouter.get("/", albumController.index);

albumRouter.get("/:id", albumController.getSingleAlbum);
albumRouter.get("/owners/:id", albumController.getAllOwnersAlbum);
albumRouter.put("/:id", albumController.updateAlbum);
albumRouter.delete("/:id", albumController.removeAlbum);
albumRouter.post("/", albumController.createAlbum);

export default albumRouter;
