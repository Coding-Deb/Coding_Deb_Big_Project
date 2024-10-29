import express from "express";
import {
  createCourse,
  deleteCourse,
  getAllReviewByCourse,
  getCourseById,
  getEnrolledUser,
} from "../controllers/course.controller.js";
import { adminCheck, verifyJWT } from "../middleware/auth.middleware.js";
const courseRouter = express.Router();

// Course Routes
courseRouter.route("/create").post(verifyJWT, adminCheck, createCourse);

courseRouter.route("/:id").get(verifyJWT, adminCheck, getEnrolledUser);

courseRouter.route("/delete/:id").delete(verifyJWT, adminCheck, deleteCourse);

courseRouter.route("/courseById/:id").put(verifyJWT, getCourseById);

courseRouter.route("/getReview/:courseId").get(verifyJWT,getAllReviewByCourse);

export default courseRouter;
