import express from "express";
import PostController from "../controllers/postController.js";
import uploadFile from "../configs/multer.config.js";
import validationMiddleware from "../middlewares/validation.middleware.js";

const postRouter = express.Router();

postRouter.post("/create", uploadFile.array("images"), PostController.validatePost, validationMiddleware, PostController.createPost);
postRouter.get("/all", PostController.getAllPosts);
postRouter.get("/all-by-user", PostController.getAllPostsByUser);
postRouter.get("/:postId", PostController.getPost);
postRouter.put("/:postId/update", PostController.updatePost);
postRouter.delete("/:postId/delete", PostController.removePost);
postRouter.put("/:postId/like", PostController.likePost);

export default postRouter;
