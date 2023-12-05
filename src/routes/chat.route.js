import express from "express";
import chatController from "../controllers/Chat.Controller.js";

const chatRoute = express.Router();

chatRoute.post("/", chatController.createChat);
chatRoute.get("/:userId", chatController.findUserChats);
chatRoute.get("/find/:firstId/:secondId", chatController.findChat);

export default chatRoute;
