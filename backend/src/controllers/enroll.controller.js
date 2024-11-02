import { asyncHandler } from "../utils/asynchandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";

import Course from "../models/course.model.js";
import User from "../models/user.model.js";
import Enroll from "../models/enrolll.model.js";

export const enrollCourse = asyncHandler(async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;
    console.log(courseId, userId);

    const course = await Course.findById(courseId);
    if (!course) {
      return apiError(res, 404, "Course not found");
    }
    const user = await User.findById(userId);
    if (!user || user.admin === true) {
      return apiError(res, 404, "User not found", "User Admin found");
    }

    const enrollment = new Enroll({
      userId: userId,
      courseId: courseId,
    });
    const createdEnroll = await enrollment.save();
    if (!createdEnroll) {
      return apiError(res, 500, "Failed to enroll course");
    }

    // Add the enrollment to the user's courses
    const updatedCourse = await enrollment.addEnrollToCourse(course, user);

    if (!updatedCourse) {
      return apiError(res, 404, "Course not found");
    }
    return apiResponse(res, 200, "Course enrolled successfully");
  } catch (error) {
    console.error(error);
    apiError(res, 500, "Internal Server Error", error.message);
  }
});

export const deleteEnroll = asyncHandler(async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;
    console.log(courseId, userId);

    const course = await Course.findById(courseId);
    if (!course) {
      return apiError(res, 404, "Course not found");
    }
    console.log(course);

    const user = await User.findById(userId);
    if (!user || user.admin === false) {
      return apiError(res, 404, "User not found", "User Admin found");
    }
    console.log(user);

    const enrollment = await Enroll.find();

    const data = await enrollment.forEach((enrollment) => {
      console.log(enrollment.courseId);
    });

    console.log(enrollment);
  } catch (error) {
    console.error(error);
    return apiError(res, 500, "Internal Server Error", error.message);
  }
});
