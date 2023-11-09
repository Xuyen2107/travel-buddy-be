import express from "express";
import PostController from "../controllers/postController.js";
import uploadFile from "../configs/multer.config.js";
import validationMiddleware from "../middlewares/validation.middleware.js";
import paramValidation from "../validations/params.validate.js";

const postRouter = express.Router();

postRouter.post("/create", uploadFile.array("images"), PostController.validatePost, validationMiddleware, PostController.createPost);
postRouter.get("/all", PostController.getAllPosts);
postRouter.get("/all-by-user", PostController.getAllPostsByUser);
postRouter.get("/:postId", paramValidation("postId"), validationMiddleware, PostController.getPost);
postRouter.put("/:postId/update", paramValidation("postId"), validationMiddleware, PostController.updatePost);
postRouter.delete("/:postId/delete", paramValidation("postId"), validationMiddleware, PostController.removePost);
postRouter.put("/:postId/like", paramValidation("postId"), validationMiddleware, PostController.likePost);

export default postRouter;
