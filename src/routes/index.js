import express from "express";
import authRouter from "./auth.route.js";
import vacationRouter from "./vacation.route.js";

const appRoute = express.Router();

appRoute.use("/auth", authRouter);
appRoute.use("/vacation", vacationRouter);

export default appRoute;
