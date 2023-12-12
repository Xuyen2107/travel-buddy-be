import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import appRoute from "./routes/index.js";
import { connectToDatabase } from "./configs/db.config.js";
import { configCloudinary } from "./configs/cloudinary.config.js";
import { errorHandlerMiddleware } from "./middlewares/error.middleware.js";
import { formatDate } from "./utils/formatDate.js";

const app = express();

app.use(express.json());

dotenv.config();
connectToDatabase();
configCloudinary();

app.use(morgan("dev"));
app.use(cors("*"));

app.use("/api/v1", appRoute);

//middleware error trung tâm
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT;

app.listen(PORT, () => {
   console.log(`Server is running on PORT ${PORT} at ${formatDate(new Date())}`);
});
