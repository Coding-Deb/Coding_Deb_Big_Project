import mongoose, { Schema } from "mongoose";

const doubtSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Doubt = mongoose.model("Doubt",doubtSchema);

export default Doubt;