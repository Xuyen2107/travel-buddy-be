import express from "express";
import CommentController from "../controllers/comment.controller.js";

const commentRouter = express.Router();

commentRouter.post("/create/:postId", CommentController.createComment);
commentRouter.get("/all-by-post/:postId", CommentController.getCommentsByPost);
commentRouter.get("/number-comment/:postId", CommentController.getNumberComment);
commentRouter.put("/update/:commentId", CommentController.updateComment);
commentRouter.put("/remove/:commentId", CommentController.removeComment);

export default commentRouter;
