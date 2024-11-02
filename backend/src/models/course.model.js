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
  Enrolled:[
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    }
  ]
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

courseSchema.methods.getCreatedCourse = async function () {
  try {
    const users = await User.find({ courses: this._id }).select(
      "-password -refreshToken -admin"
    );
    return users;
  } catch (error) {
    apiError(res, 400, "Course Not Found !!!", "Course Unavailable !!!");
  }
};

courseSchema.methods.updateCourse = async function (updateData) {
  try {
    Object.assign(this, updateData);
    const updatedCourse = await this.save();
    return updatedCourse;
  } catch (error) {
    throw new Error("Error updating course");
  }
};

const Course = mongoose.model("Course", courseSchema);

export default Course;
