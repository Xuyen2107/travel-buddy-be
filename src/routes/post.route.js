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
postRouter.get("/:id", postController.getSingle);
postRouter.put("/:id", postController.update);
postRouter.delete("/:id", postController.remove);
postRouter.post("/", validationMiddleware(postSchema), postController.create);

//Like
postRouter.put("/:id/like", postController.likePost);

export default postRouter;
