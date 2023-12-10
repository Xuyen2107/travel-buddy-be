import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { logAPI } from "../middlewares/logAPI.middleware.js";
import albumRouter from "./album.route.js";
import authRouter from "./auth.route.js";
import postRouter from "./post.route.js";
import userRoute from "./user.route.js";
import vacationRouter from "./vacation.route.js";
import passwordRoute from "./password.route.js";
import commentRouter from "./comment.route.js";
import replyCommentRouter from "./replyComment.route.js";
import notifyRouter from "./notify.route.js";

const appRoute = express.Router();

appRoute.use(logAPI);

appRoute.use("/auth", authRouter);
appRoute.use("/password", passwordRoute);
appRoute.use("/user", authMiddleware, userRoute);
appRoute.use("/vacation", authMiddleware, vacationRouter);
appRoute.use("/post", authMiddleware, postRouter);
appRoute.use("/album", authMiddleware, albumRouter);
appRoute.use("/comment", authMiddleware, commentRouter);
appRoute.use("/reply-comment", authMiddleware, replyCommentRouter);
appRoute.use("/notify", authMiddleware, notifyRouter);

export default appRoute;
