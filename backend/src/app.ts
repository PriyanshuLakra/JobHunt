
import express from "express";

import { config } from "dotenv";

import cookieParser from "cookie-parser";
import cors from "cors";
import  {errorMiddleware } from "./Middlewares/error";
import fileUpload from "express-fileupload";

import UserRouter from "./Routes/UserRoutes"
import JobRouter from "./Routes/JobRoutes"
import ApplicationRouter from "./Routes/ApplicationsRoutes"
const app = express()


config({path:'./config/config.env'});

app.use(cors({
    origin:[process.env.FRONTEND_URL ||  "http://localhost:5173"],
    methods:["GET","POST","DELETE","PUT"],
    credentials:true
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
    fileUpload({
      useTempFiles: true,
      tempFileDir: "/tmp/",
    })
  );


app.use(cookieParser());


app.use("/api/v1/user" , UserRouter);
app.use("/api/v1/job" , JobRouter);
app.use("/api/V1/application" , ApplicationRouter);


app.use(errorMiddleware)





export default app







