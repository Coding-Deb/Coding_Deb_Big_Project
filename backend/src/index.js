import express from "express";
import dotenv from "dotenv";
import dbConnection from "./db/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import courseRouter from "./routes/course.routes.js";
import reviewRouter from "./routes/review.routes.js";
import enrollRouter from "./routes/enroll.routes.js";

// SETUP EXPRESS
const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// ENV CONFIG
dotenv.config({
  path: "./.env",
});

app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

// COOKIE PARSER
app.use(cookieParser());

// ROUTES
app.use("/api/v1/users", userRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/review",reviewRouter);
app.use("/api/v1/enroll",enrollRouter)

// DATABASE CONNECTION
dbConnection();

// LISTEN APP
app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT || 5000}`);
});
