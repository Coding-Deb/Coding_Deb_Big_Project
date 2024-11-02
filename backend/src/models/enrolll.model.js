import mongoose, { Schema } from "mongoose";
import User from "./user.model.js";
import apiError from "../utils/apiError.js";
import Course from "./course.model.js";

const enrollSchema = new Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true, // Ensure userId is always provided
  },
  courseId: {
    type: mongoose.Types.ObjectId,
    ref: "Course",
    required: true, // Ensure courseId is always provided
  },
  enrollmentDate: {
    type: Date,
    default: Date.now, // Use default for enrollmentDate
  },
});

enrollSchema.methods.addEnrollToCourse = async function (course, user) {
  const courseEnrolled = await Course.findByIdAndUpdate(
    course._id,
    {
      $push: {
        Enrolled: user._id,
      },
    },
    {
      new: true,
    }
  );

  if (!courseEnrolled) {
    console.log("Course not found");
  }

  const userEnrolled = await User.findByIdAndUpdate(
    user._id,
    {
      $push: {
        enrollments: course._id,
      },
    },
    {
      new: true,
    }
  );
  if (!userEnrolled) {
    console.log("User not found");
  }
  return userEnrolled;
};

enrollSchema.methods.deleteEnrollFromCourse = async function (course, user) {
  const courseEnrolled = await Course.findByIdAndUpdate(
    course._id,
    {
      $pull: {
        Enrolled: user._id,
      },
    },
    {
      new: true,
    }
  );

  if (!courseEnrolled) {
    console.log("Course not found");
  }

  const userEnrolled = await User.findByIdAndUpdate(
    user._id,
    {
      $pull: {
        enrollments: course._id,
      },
    },
    {
      new: true,
    }
  );
  if (!userEnrolled) {
    console.log("User not found");
  }
  
  return enrolled;
};
const Enroll = mongoose.model("Enroll", enrollSchema);

export default Enroll;
