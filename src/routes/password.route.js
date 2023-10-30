import express from "express";
import PasswordController from "../controllers/password.controller.js";
import userValidation from "../validations/user.validation.js";
import validationMiddleware from "../middlewares/validation.middleware.js";

const passwordRoute = express.Router();

passwordRoute.post("/forgot", PasswordController.forgotPassword);
passwordRoute.post("/verify", userValidation("forgotPassword"), validationMiddleware, PasswordController.verifyPassword);

export default passwordRoute;
