import { asyncHandler } from "../utils/asynchandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";

import Course from "../models/course.model.js";
import User from "../models/user.model.js";

export const enrollCourse = asyncHandler(async (req, res, next) => {

    const { courseId } = req.params;
    const userId = req.use.id;

    const course = await Course.findById(courseId);
    if (!course) {
        return apiError(res, 404, "Course Not Found !!!", "Course Unavailable !!!");
    }
    
})