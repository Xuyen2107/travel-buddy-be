import express from "express";
import postController from "../controllers/postController.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validationMiddleware } from "../middlewares/validate.middleware.js";
import postSchema from "../validations/postValidation.js";

const postRouter = express.Router();

postRouter.use(authMiddleware);

postRouter.get("/", postController.index);
postRouter.post("/", validationMiddleware(postSchema), postController.create);

export default postRouter;
