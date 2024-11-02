import express from "express";
import { adminCheck, verifyJWT } from "../middleware/auth.middleware.js";
import {
  deleteEnroll,
  enrollCourse,
} from "../controllers/enroll.controller.js";

const enrollRouter = express.Router();

enrollRouter.route("/:courseId").post(verifyJWT, enrollCourse);

enrollRouter.route("/:courseId").delete(verifyJWT, adminCheck, deleteEnroll);

export default enrollRouter;
