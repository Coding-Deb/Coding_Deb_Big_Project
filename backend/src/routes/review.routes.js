import express from "express";
import { addReview, deleteReview } from "../controllers/review.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const reviewRouter = express.Router();

// Add a review
reviewRouter.route("/add/:courseId").post(verifyJWT, addReview);

reviewRouter.route("/delete/:reviewId").delete(verifyJWT, deleteReview);

export default reviewRouter;
