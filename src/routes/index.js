import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import albumRouter from "./album.route.js";
import authRouter from "./auth.route.js";
import postRouter from "./post.route.js";
import userRoute from "./user.route.js";
import vacationRouter from "./vacation.route.js";

const appRoute = express.Router();

appRoute.use("/auth", authRouter);
appRoute.use("/user", authMiddleware, userRoute);
appRoute.use("vacation", authMiddleware, vacationRouter);
appRoute.use("/post", authMiddleware, postRouter);
appRoute.use("/album", authMiddleware, albumRouter);

export default appRoute;
