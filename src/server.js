import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { errorHandleMiddleware } from "./middlewares/error.middleware.js";
import { connectToDatabase } from "./configs/database.config.js";
import { formatDate } from "./utils/formatDate.js";
import appRoute from "./routes/index.js";
import { configCloudinary } from "./configs/cloudinary.config.js";

const app = express();

app.use(express.json());

dotenv.config();
connectToDatabase();
configCloudinary();

app.use(morgan("dev"));
app.use(cors("*"));

app.use("/api/v1", appRoute);

app.use(errorHandleMiddleware);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
   console.log(`Server is running on PORT ${PORT} at ${formatDate(new Date())}`);
});
