import express from "express";
import VacationController from "../controllers/vacation.controller.js";
import uploadFile from "../configs/multer.config.js";
import validationMiddleware from "../middlewares/validation.middleware.js";

const vacationRouter = express.Router();

vacationRouter.post(
   "/create",
   uploadFile.single("avatarVacation"),
   VacationController.validateVacation(),
   validationMiddleware,
   VacationController.createVacation,
);
vacationRouter.get("/:vacationId", VacationController.getVacation);
vacationRouter.get("/all", VacationController.getAllVacations);
vacationRouter.put(
   "/:vacationId/update",
   uploadFile.single("avatarVacation"),
   VacationController.validateVacation(),
   validationMiddleware,
   VacationController.updateVacation,
);
vacationRouter.delete("/:vacationId/remove", VacationController.removeVacation);

export default vacationRouter;
