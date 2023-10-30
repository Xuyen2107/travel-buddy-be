import express from "express";
import AuthController from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import validationMiddleware from "../middlewares/validation.middleware.js";
import userValidation from "../validations/user.validation.js";

const authRouter = express.Router();

authRouter.post("/register", userValidation("register"), validationMiddleware, AuthController.register);
authRouter.post("/login", userValidation("login"), validationMiddleware, AuthController.login);
authRouter.get("/profile", authMiddleware, AuthController.profile);

export default authRouter;
