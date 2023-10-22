import express from "express";
import vactionController from "../controllers/vacation.controller.js";
import { validationMiddleware } from "../middlewares/validate.middleware.js";
import vacationSchema from "../validations/vacationValidation.js";
import uploadFile from "../configs/multer.config.js";

const vacationRouter = express.Router();

vacationRouter.post("/createa", uploadFile.array("imgsVacation"), (req, res) => {
    const file = req.files;
    console.log("🚀 ~ file: vacation.route.js:11 ~ vacationRouter.post ~ file:", file);
    res.send("API TSte");
});

vacationRouter.get("/all", vactionController.index);
vacationRouter.post(
    "/create",
    validationMiddleware(vacationSchema),
    // uploadFile.array("imgsVacation"),
    vactionController.create
);
vacationRouter.put("/update/:id", validationMiddleware(vacationSchema), vactionController.update);
vacationRouter.delete("/remove/:id", vactionController.remove);
vacationRouter.delete("/removeall", vactionController.removeAll);

export default vacationRouter;
