import express from "express";
import messageController from "../controllers/message.controller.js";

const messageRoute = express.Router();

messageRoute.post("/", messageController.createMessage);
messageRoute.get("/:chatId", messageController.getMessages);

export default messageRoute;
