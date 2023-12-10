import express from "express";
import messageController from "../controllers/message.controller.js";

const messageRoute = express.Router();

messageRoute.post("/create", messageController.createMessage);
messageRoute.get("/get-all-by-chat/:chatId", messageController.getMessages);

export default messageRoute;
