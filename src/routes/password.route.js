import express from "express";
import PasswordController from "../controllers/password.controller.js";

const passwordRoute = express.Router();

passwordRoute.post("/forgot", PasswordController.forgotPassword);
passwordRoute.post("/verify", PasswordController.verifyPassword);

export default passwordRoute;
