import express from "express";
import VacationController from "../controllers/vacation.controller.js";
import uploadFile from "../configs/multer.config.js";
import validationMiddleware from "../middlewares/validation.middleware.js";

const vacationRouter = express.Router();

vacationRouter.post(
   "/create",
   uploadFile.single("avatarVacation"),
   VacationController.validateVacation,
   validationMiddleware,
   VacationController.createVacation,
);
vacationRouter.get("/all", VacationController.getAllVacations);
vacationRouter.get("/all-user", VacationController.getAllVacationsUser);
vacationRouter.get("/all-by-user", VacationController.getVacationsByUserId);
vacationRouter.get("/single/:vacationId", VacationController.getSingleVacation);
vacationRouter.put("/update/:vacationId", uploadFile.single("avatarVacation"), validationMiddleware, VacationController.updateVacation);
vacationRouter.delete("/remove/:vacationId", VacationController.removeVacation);
vacationRouter.put("/like/:vacationId", VacationController.likeVacation);

export default vacationRouter;
