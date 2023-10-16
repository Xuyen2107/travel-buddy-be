import express from "express";
import authRouter from "./auth.route.js";
import postRouter from "./post.route.js";
import userRoute from "./user.route.js";

const appRoute = express.Router();

appRoute.use("/auth", authRouter);
appRoute.use("/user", userRoute);
appRoute.use("/post", postRouter);

export default appRoute;
