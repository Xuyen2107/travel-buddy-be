import express from "express";
import AuthController from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validationMiddleware } from "../middlewares/validate.middleware.js";
import loginSchema from "../validations/loginValidation.js";
import registerSchema from "../validations/registerValidation.js";
import { logAPI } from "../middlewares/logAPI.middleware.js";

const authRouter = express.Router();
authRouter.use(logAPI);

authRouter.post("/register", validationMiddleware(registerSchema), AuthController.register);
authRouter.post("/login", validationMiddleware(loginSchema), AuthController.login);
authRouter.get("/profile", authMiddleware, AuthController.profile);

export default authRouter;
