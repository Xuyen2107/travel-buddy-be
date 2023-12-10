import express from "express";
import NotifyController from "../controllers/notify.controller.js";

const notifyRouter = express.Router();

notifyRouter.get("/all-for-recipient", NotifyController.getAllNotifiesForRecipient);

export default notifyRouter;
