import mongoose, { Schema } from "mongoose";
import User from "./user.model.js";
import apiError from "../utils/apiError.js";
import Review from "./review.model.js";

const courseSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    // required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: [
      "Web Development",
      "Mobile Development",
      "Data Science",
      "Machine Learning",
      "Artificial Intelligence",
      "Business",
      "Marketing",
      "Design",
      "Personal Development",
      "Photography",
      "Music",
      "Language",
      "Other",
    ],
  },
  level: {
    type: String,
    required: true,
    enum: ["Beginner", "Intermediate", "Advanced"],
  },
  duration: {
    type: String,
    // required: true,
  },
  language: {
    type: String,
    // required: true,
    enum: ["English", "Hindi", "Bengali"],
  },
  instructor: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
});

courseSchema.methods.addCourseToUser = async function (userId) {
  try {
    const courseuser = await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          courses: this._id,
        },
      },
      {
        new: true,
      }
    );
    console.log(courseuser);

    return courseuser;
  } catch (error) {
    return apiError(res, 404, "Course Not Found !!!", "Course Unavailable !!!");
  }
};

courseSchema.methods.deleteCourseFromUser = async function (userId) {
  try {
    const courseuser = await User.findByIdAndUpdate(
      userId,
      {
        $pull: {
          courses: this._id,
        },
      },
      {
        new: true,
      }
    );
    console.log(courseuser);

    return courseuser;
  } catch (error) {
    console.log(error);

    apiError(res, 404, "Course Not Found !!!", "Course Unavailable !!!");
  }
};

courseSchema.methods.getUsersEnrolled = async function () {
  try {
    const users = await User.find({ courses: this._id }).select(
      "-password -refreshToken -admin"
    );
    return users;
  } catch (error) {
    apiError(res, 400, "Course Not Found !!!", "Course Unavailable !!!");
  }
};

courseSchema.methods.getAllReview = async function () {
  try {
    const reviews = await Review.find({ course: this._id }).populate("user",{
      "username": 1,
      "_id": 0
    })
     return reviews;
  } catch (error) {
    apiError(
      res,
      400,
      "Course Not Found !!!",
      "Course Unavailable !!!"
    )
  }
}
const Course = mongoose.model("Course", courseSchema);

export default Course;
