import { asyncHandler } from "../utils/asynchandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";

import Review from "../models/review.model.js";
import Course from "../models/course.model.js";
import User from "../models/user.model.js";

export const addReview = asyncHandler(async (req, res, next) => {
  try {
    const {courseId} = req.params;
    const {rating, comment} = req.body;

  //  const course = await Course.findById(courseId);

    const review = new Review({
      rating,
      comment,
      user: req.user.id,
      course: courseId
    }) 

    await review.save();
    const courseUpdated = await review.addReviewToComment(courseId);
    console.log(courseUpdated);
    

    return apiResponse(res, 200, "Review Added Successfully", review);
  } catch (error) {
    console.log(error);

    apiError(res, 404, "Course Not Found !!!", "Course Unavailable !!!");
  }
});

export const deleteReview = asyncHandler(async (req, res, next) => {
  try {
    const {reviewId} = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
      return apiError(res, 404, "Review Not Found !!!", "Review Unavailable !!!");
    }

    const deleteReview = await Review.findByIdAndDelete(reviewId);

    if (!deleteReview) {
      return apiError(res, 404, "Review Not Found !!!", "Review Unavailable !!!");
    }

    const courseUpdated = await review.deleteReviewFromComment(review.course);

    return apiResponse(res, 200, "Review Deleted Successfully", courseUpdated);
  } catch (error) {
    apiError(res, 404, "Course Not Found !!!", "Course Unavailable !!!");
  }
})