import express from "express";
import {
  createCourse,
  deleteCourse,
  getCourseById,
  getCourseCreatedUser,
  updateCourseById,
} from "../controllers/course.controller.js";
import { adminCheck, verifyJWT } from "../middleware/auth.middleware.js";
const courseRouter = express.Router();

// Course Routes
courseRouter.route("/create").post(verifyJWT, adminCheck, createCourse);

courseRouter.route("/:courseId").get(verifyJWT, adminCheck, getCourseCreatedUser);

courseRouter.route("/update/:courseId").put(verifyJWT,updateCourseById);

courseRouter.route("/delete/:courseId").delete(verifyJWT, adminCheck, deleteCourse);

courseRouter.route("/courseById/:id").put(verifyJWT, getCourseById);



export default courseRouter;
