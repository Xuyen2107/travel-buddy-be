import express from "express";
import AuthController from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validationMiddleware } from "../middlewares/validate.middleware.js";
import loginSchema from "../validations/loginValidation.js";
import registerSchema from "../validations/registerValidation.js";

const authRouter = express.Router();

authRouter.post("/register", validationMiddleware(registerSchema), AuthController.register);
authRouter.post("/login", validationMiddleware(loginSchema), AuthController.login);
authRouter.get("/profile", authMiddleware, AuthController.profile);

export default authRouter;
