import express from "express";
import PostController from "../controllers/postController.js";

const postRouter = express.Router();

postRouter.post("/create", PostController.createPost);
postRouter.get("/all", PostController.getAllPosts);
postRouter.get("/all-by-user", PostController.getAllPostsByUser);
postRouter.get("/:postId", PostController.getPost);
postRouter.put("/:postId/update", PostController.updatePost);
postRouter.delete("/:postId/delete", PostController.removePost);
postRouter.put("/:postId/like", PostController.likePost);

export default postRouter;
