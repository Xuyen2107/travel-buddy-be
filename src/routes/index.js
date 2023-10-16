import express from "express";
import authRouter from "./auth.route.js";
import userRoute from "./user.route.js";

const appRoute = express.Router();

appRoute.use("/auth", authRouter);
appRoute.use("/user", userRoute)

export default appRoute;