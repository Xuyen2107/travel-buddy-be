import express from "express";
import VacationController from "../controllers/vacation.controller.js";
import { validationMiddleware } from "../middlewares/validate.middleware.js";
import vacationSchema from "../validations/vacationValidation.js";
import uploadFile from "../configs/multer.config.js";

const vacationRouter = express.Router();

vacationRouter.post("/create", uploadFile.single("Vacation"), validationMiddleware(vacationSchema), VacationController.createVacation);
vacationRouter.get("/:id", VacationController.getVacation);
vacationRouter.get("/all", VacationController.getAllVacations);
vacationRouter.put("/:id/update", validationMiddleware(vacationSchema), VacationController.updateVacation);
vacationRouter.delete("/:id/remove", VacationController.removeVacation);
vacationRouter.delete("/remove-all", VacationController.removeAllVacations);

export default vacationRouter;
