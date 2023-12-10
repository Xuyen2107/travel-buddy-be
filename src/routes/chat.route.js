import express from "express";
import chatController from "../controllers/Chat.Controller.js";

const chatRoute = express.Router();

chatRoute.post("/create/:userChat", chatController.createChat);
chatRoute.get("/chat-by-user", chatController.findUserChats);
chatRoute.get("/find-chat/:userChat", chatController.findByChat);
chatRoute.get("/find/:userChat", chatController.findChat);

export default chatRoute;
