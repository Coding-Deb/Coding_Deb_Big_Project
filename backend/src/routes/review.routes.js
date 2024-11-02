import express from "express";
import { addReview, deleteReview, updateReview } from "../controllers/review.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
const reviewRouter = express.Router();

// Add a review
// reviewRouter.route("/add/:courseId").post(verifyJWT, addReview);

// reviewRouter.route("/delete/:reviewId").delete(verifyJWT, deleteReview); 

// reviewRouter.route("/update/:reviewId").put(verifyJWT,updateReview);

export default reviewRouter;
