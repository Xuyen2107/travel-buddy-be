import express from "express";
import ReplyCommentController from "../controllers/replyComment.controller.js";

const replyCommentRouter = express.Router();

replyCommentRouter.post("/create/:commentId", ReplyCommentController.createComment);
replyCommentRouter.get("/all-by-post/:commentId", ReplyCommentController.getAllByCommentId);
replyCommentRouter.put("/update/:commentId", ReplyCommentController.updateComment);
replyCommentRouter.delete("/remove/:commentId", ReplyCommentController.removeComment);

export default replyCommentRouter;
