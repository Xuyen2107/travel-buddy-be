import express from "express";
import authRouter from "./auth.route.js";

const appRoute = express.Router();

appRoute.use("/auth", authRouter);

export default appRoute;