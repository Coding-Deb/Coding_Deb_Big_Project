import mongoose, { Schema } from "mongoose";
import apiError from "../utils/apiError.js";
import Course from "./course.model.js";

const reviewSchema = new Schema({
  rating: {
    type: Number,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
});

reviewSchema.methods.addReviewToComment = async function (courseId) {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          reviews: this._id,
        },
      },
      {
        new: true,
      }
    );
    return updatedCourse;
  } catch (error) {
    console.log(error);
    apiError(res, 404, "Course Not Found !!!", "Course Unavailable !!!");
  }
};

reviewSchema.methods.deleteReviewFromComment = async function (courseId) {
  try {
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $pull: {
          reviews: this._id,
        },
      },
      {
        new: true,
      }
    );
    return updatedCourse;
  } catch (error) {
    apiError(res, 404, "Course Not Found !!!", "Course Unavailable !!!");
  }
};

reviewSchema.methods.updateReview = async function (updateData){

  Object.assign(this, updateData);

  const updatedReview = await this.save();

  return updatedReview;
}

const Review = mongoose.model("Review", reviewSchema);

export default Review;
