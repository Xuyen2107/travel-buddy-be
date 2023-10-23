import express from "express";
import postController from "../controllers/postController.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validationMiddleware } from "../middlewares/validate.middleware.js";
import postSchema from "../validations/postValidation.js";

const postRouter = express.Router();

postRouter.use(authMiddleware);

postRouter.get("/", postController.index);

//Basic CRUD
postRouter.get("/all", postController.getAllPosts);
postRouter.get("/:id/all-post", postController.getAllPostsByUser);
postRouter.get("/:id", postController.getPost);
postRouter.put("/:id/update", postController.updatePost);
postRouter.delete("/:id/delete", postController.removePost);
postRouter.post("/create", postController.createPost);
//Like
postRouter.put("/:id/like", postController.likePost);

export default postRouter;
