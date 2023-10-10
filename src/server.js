import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { errorHandleMiddleware } from "./middlewares/error.middleware.js";
import { connectToDatabase } from "./configs/database.config.js";
import { formatDate } from "./utils/formatDate.js";
import appRoute from "./routes/index.js";

const app = express();

dotenv.config();
connectToDatabase();

app.use(morgan("dev"));
app.use(cors("*"));
app.use(express.json());
app.use(errorHandleMiddleware);

app.use("/api/v1", appRoute);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
   console.log(`Server is running on PORT ${PORT} at ${formatDate(new Date())}`);
});
