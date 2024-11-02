import { asyncHandler } from "../utils/asynchandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";

import Course from "../models/course.model.js";
import User from "../models/user.model.js";
import Review from "../models/review.model.js";
// import { uploadFile } from "../helpers/cloudinary";

export const createCourse = asyncHandler(async (req, res, next) => {
  const { name, description, price, category, level } = req.body;
  //   const image = req.file;
  const id = req.user.id;

  if (!name || !description || !price || !category || !level) {
    return apiError(res, 400, "Please Provide All the Fields");
  }
  //   if (!image) {
  //     return apiError(res, 500, "Image Not Found !!!", "Image Unavailable !!!");
  //   }
  //   const uploadedImage = await uploadFile(image);

  //   if (!uploadedImage) {
  //     return apiError(res, 500, "Image Not Found !!!", "Image Unavailable !!!");
  //   }

  const user = await User.findById(id);

  if (!user || user.admin === false) {
    return apiError(res, 500, "User Not Found !!!", "User Unavailable !!!");
  }

  const course = await Course.create({
    name,
    description,
    // image: uploadedImage.url || "",
    price,
    category,
    level,
    instructor: user._id,
  });

  if (!course) {
    return apiError(res, 500, "Course Not Found !!!", "Course Unavailable !!!");
  }

  const updatedStudentData = await course.addCourseToUser(id);

  // console.log(updatedStudentData);

  return apiResponse(
    res,
    201,
    "Course Created Successfully",
    updatedStudentData
  );
});

export const getCourseCreatedUser = asyncHandler(async (req, res, next) => {
  try {
    const { courseId } = req.params;

    const course = await Course.findById(courseId);

    if (!course) {
      return apiError(
        res,
        500,
        "Course Not Found !!!",
        "Course Unavailable !!!"
      );
    }

    const enrolledUser = await course.getCreatedCourse();

    if (!enrolledUser) {
      return apiError(
        res,
        500,
        "Course Not Found !!!",
        "Course Unavailable !!!"
      );
    }

    return apiResponse(res, 200, "Enrolled User", enrolledUser);
  } catch (error) {
    return apiError(res, 500, "Course Not Found !!!", "Course Unavailable !!!");
  }
});

export const deleteCourse = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;

  const userId = req.user.id;

  const course = await Course.findById(id);

  if (!course) {
    return apiError(res, 500, "Course Not Found !!!", "Course Unavailable !!!");
  }

  const deletedCourse = await Course.findByIdAndDelete(courseId);

  if (!deletedCourse) {
    return apiError(res, 500, "Course Not Found !!!", "Course Unavailable !!!");
  }

  const updatedCourse = await course.deleteCourseFromUser(userId);
  console.log(updatedCourse);

  return apiResponse(res, 200, "Course Deleted Successfully", course);
});

export const getCourseById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const course = await Course.findById(id);

  if (!course) {
    return apiError(res, 500, "Course Not Found !!!", "Course Unavailable !!!");
  }

  return apiResponse(res, 200, "Course", course);
});

export const updateCourseById = asyncHandler(async (req, res, next) => {
  const { courseId } = req.params;
  const updateData = req.body;

  try {
    const course = await Course.findById(courseId);

    if (!course) {
      return apiError(res, 404, "Course Not Found", "Course Unavailable");
    }

    const updatedCourse = await course.updateCourse(updateData);

    return apiResponse(res, 200, "Course Updated Successfully", updatedCourse);
  } catch (error) {
    return apiError(res, 500, "Error updating course", error.message);
  }
});
