import mongoose, { Schema } from "mongoose";

const assignmentSchema = new Schema({
  courseId: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  dueDate: {
    type: Date,
    required: true,
  },
});

const Assignment = mongoose.model("Assignment", assignmentSchema);

export default Assignment;
