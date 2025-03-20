import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import userRouter from "./routes/userRouter.js";
import jobRouter from "./routes/jobRouter.js";
import applicationRouter from "./routes/applicationRouter.js";
import dbConnection from "./database/dbconnection.js";

const app = express();
dotenv.config();
app.use(
  cors({
    origin: ["https://careercompass-seven.vercel.app"],
    methods: ["GET", "PUT", "POST", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/temp/",
  })
);

app.get("/", (req, res) => {
  res.send("Login route is working!");
});

app.use("/api/user", userRouter);
app.use("/api/job", jobRouter);
app.use("/api/application", applicationRouter);
dbConnection();

export default app;
