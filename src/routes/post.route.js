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
postRouter.get("/owners/:id", postController.getAllOwnerPosts);
postRouter.get("/:id", postController.getSinglePost);
postRouter.put("/:id", postController.updatePost);
postRouter.delete("/:id", postController.removePost);
postRouter.post("/", postController.createPost);

//Like
postRouter.put("/:id/like", postController.likePost);
postRouter.post("/:id/comment", postController.commentOnPost);

export default postRouter;
